const dropAllTables = require("./dropTables.js");
const createAllTables = require("./createTables.js");
const insertAllData = require("./insertData.js");

async function seed() {
  await dropAllTables();

  await createAllTables();

  await insertAllData();
}

module.exports = seed;
