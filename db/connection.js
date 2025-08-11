const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "dev";

console.log(ENV);

require("dotenv").config({ path: `${__dirname}/../.evn.${ENV}` });

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const pool = new Pool(config);

module.exports = pool;
