const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "dev";

console.log(ENV);

require("dotenv").config({ path: `${__dirname}/../.evn.${ENV}` });

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);

module.exports = pool;
