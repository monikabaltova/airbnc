const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "dev";

console.log(ENV);

require("dotenv").config({ path: `${__dirname}/../.evn.${ENV}` });

const pool = new Pool();

module.exports = pool;
