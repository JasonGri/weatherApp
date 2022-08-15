"use strict";

const express = require("express");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const getWeather = require("./utils/weatherAPI");

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

  app.use(bodyParser.urlencoded({ extended: true }));

  const requestIp = require("request-ip");
  app.all("/", async (req, res) => {
    const context = {};

    // Get client IP address
    const clientIp = requestIp.getClientIp(req);
    // console.log(clientIp);

    // Get client coordinates using the IP
    const testIp = "46.103.243.18";
    const ipUrl = `http://api.ipstack.com/${testIp}?access_key=${process.env.IPSTACK_KEY}`;

    const fetchData = async (url) => {
      try {
        let res = await fetch(url);
        return res.json();
      } catch (err) {
        console.error(err);
      }
    };
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

    if (req.method === "POST") {
      const city = req.body.city;
      const weather = await getWeather(testUnit, undefined, undefined, city);

      context["weather"] = weather;
      context["city"] = city;
    }

    res.render("pages/index", context);
  });

  app.get("/news", (req, res) => {
    res.render("pages/news");
  });

  app.get("/about", (req, res) => {
    res.render("pages/about");
  });

  return app;
};
