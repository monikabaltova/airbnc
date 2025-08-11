const devData = require("./dev");
const testData = require("./test");

const ENV = process.env.NODE_ENV || "dev";

const data = { dev: devData, test: testData };

module.exports = data[ENV];
