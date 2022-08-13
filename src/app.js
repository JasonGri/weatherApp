"use strict";

const express = require("express");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

  const requestIp = require("request-ip");
  app.get("/", async (req, res) => {
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

    // Get client current local weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${testLat}&lon=${testLon}8&units=metric&appid=${process.env.OPENWEATHER_KEY}`;

    // console.log(await getWeather(weatherUrl));
    const weatherData = await fetchData(weatherUrl); // This is an object NOT a promise

    // Get the weather Icon
    const icons = {
      "01": [800],
      "02": [801],
      "03": [803],
      "04": [804],
      "09": [300, 301, 302, 310, 311, 312, 313, 314, 321, 520, 521, 522, 531],
      10: [500, 501, 502, 503, 504],
      11: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
      13: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622, 511],
      50: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
    };
    const code = weatherData.weather[0].id;
    const today = new Date();
    const time = today.toUTCString().slice(17, 25);
    const sunrise = new Date(weatherData.sys.sunrise * 1000)
      .toISOString()
      .slice(11, 18);
    const sunset = new Date(weatherData.sys.sunset * 1000)
      .toISOString()
      .slice(11, 18);

    const getIcon = (code, time, sunrise, sunset) => {
      let num;
      let letter;
      for (let [key, value] of Object.entries(icons)) {
        if (value.includes(code)) num = key;
      }
      if (time > sunrise && time < sunset) letter = "d";
      letter = "n";

      return num + letter;
    };
    const icon = getIcon(code, time, sunrise, sunset);

    const weather = {
      type: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      temp: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      temp_min: weatherData.main.temp_min,
      temp_max: weatherData.main.temp_max,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      wind_speed: weatherData.wind.speed,
      wind_degrees: weatherData.wind.deg,
      sunrise: sunrise,
      sunset: sunset,
      icon: `http://openweathermap.org/img/wn/${icon}@2x.png`,
    };

    console.log(weather);
    res.render("pages/index", {
      location: testLocation,
      weather: weather,
    });
  });

  app.get("/news", (req, res) => {
    res.render("pages/news");
  });

  app.get("/about", (req, res) => {
    res.render("pages/about");
  });

  return app;
};
