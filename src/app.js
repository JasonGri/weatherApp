"use strict";

const express = require("express");
const path = require("path");

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

  app.get("/", (req, res) => {
    res.render("pages/index");
  });

  app.get("/news", (req, res) => {
    res.render("pages/news");
  });

  app.get("/about", (req, res) => {
    res.render("pages/about");
  });

  return app;
};
