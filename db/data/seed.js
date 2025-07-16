const db = require("./connection.js");

async function seed() {
  await db.query(`CREATE TABLE property_types(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
    )`);
  console.log("success");
}

module.exports = seed;
