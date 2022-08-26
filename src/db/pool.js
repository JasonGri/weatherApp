"use strict";

const pg = require("pg");
require("dotenv").config();

const pool = new pg.Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  url: process.env.DATABASE_URL,
});

module.exports = pool;
// $env:DATABASE_URL=process.env.DATABASE_URL; npm run migrate up
// set DATABASE_URL=postgres://postgress:Password@localhost:5432/weatherApp&&npm run migrate down
