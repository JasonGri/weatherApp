"use strict";

const pg = require("pg");
require("dotenv").config();

const pool = new pg.Pool({
  host: "localhost",
  database: process.env.DATABASE,
  user: "postgres",
  password: process.env.DATABASE_PASSWORD,
  url: process.env.DATABASE_URL,
});

module.exports = pool;
// $env:DATABASE_URL=process.env.DATABASE_URL; npm run migrate up
