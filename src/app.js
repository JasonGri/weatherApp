"use strict";

const express = require("express");
const path = require("path");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const getWeather = require("./utils/weatherAPI");
const usersRouter = require("./routes/users");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const auth = require("./middlewares/auth");

const app = express();

module.exports = () => {
  app.set("views", path.join(__dirname, "/views"));

  app.set("view engine", "ejs");

  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    "/css",
    express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
  );
  app.use(
    "/js",
    express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
  );

  app.use(bodyParser.urlencoded({ extended: false }));

  // Authentication with passport js
  app.use(flash());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(auth.isLoggedIn);

  // Routes
  const requestIp = require("request-ip");
  app.all("/", async (req, res) => {
    const context = {
      flashMessages: {
        error: req.flash("failure"),
        success: req.flash("success"),
      },
    };
    // const context = { currentUser: req.user.name };

    // Get client IP address
    const clientIp = requestIp.getClientIp(req);
    // console.log(clientIp);

    // Get client coordinates using the IP
    const testIp = "46.103.243.18";
    const ipUrl = `http://api.ipstack.com/${testIp}?access_key=${process.env.IPSTACK_KEY}`;

    // console.log(await getCoords(ipUrl));
    // const ipData = await fetchData(ipUrl); // This is an object NOT a promise
    // const lon = ipData["longitude"];
    // const lat = ipData["latitude"];
    // console.log(lon, lat);
    // const location = `${ipData["city"]}, ${ipData["country_code"]}`;
    // console.log(location);
    const testLon = "23.72";
    const testLat = "37.97";
    const testLocation = "Athens, GR";
    const testUnit = "metric";

    const localWeather = await getWeather(testUnit, testLat, testLon);
    context["localWeather"] = localWeather;
    context["location"] = testLocation;

    let weather = {};
    let city = "";

    if (req.method === "POST") {
      city = req.body.city;
      weather = await getWeather(testUnit, undefined, undefined, city);
    }
    context["weather"] = weather;
    context["city"] = city;

    // console.log(req.session);
    // console.log(res.locals.login);
    console.log(context);
    res.render("pages/index", context);
  });

  app.get("/news", (req, res) => {
    res.render("pages/news");
  });

  app.get("/about", (req, res) => {
    res.render("pages/about");
  });

  app.use("/users", usersRouter);

  return app;
};
