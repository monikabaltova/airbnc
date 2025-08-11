const db = require("./connection");

async function dropAllTables() {
  await db.query(`DROP TABLE IF EXISTS bookings`);
  await db.query(`DROP TABLE IF EXISTS favourites`);
  await db.query(`DROP TABLE IF EXISTS images`);
  await db.query(`DROP TABLE IF EXISTS reviews`);
  await db.query(`DROP TABLE IF EXISTS properties`);
  await db.query(`DROP TABLE IF EXISTS property_types`);
  await db.query(`DROP TABLE IF EXISTS users`);
}

module.exports = dropAllTables;
