const db = require("./connection.js");
const format = require("pg-format");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
} = require("./test/index.js");
const formattedData = require("./utils/formatedData.js");

async function seed() {
  await db.query(`DROP TABLE IF EXISTS property_types`);
  await db.query(`DROP TABLE IF EXISTS users`);

  await db.query(`CREATE TABLE property_types(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
    )`);

  const formattedPropertyData = formattedData(propertyTypesData);

  await db.query(
    format(
      `INSERT INTO property_types(property_type, description ) 
    VALUES %L`,
      formattedPropertyData
    )
  );

  await db.query(`CREATE TABLE users(
      user_id SERIAL,
      first_name VARCHAR NOT NULL,
      surname VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone_number VARCHAR,
      is_host BOOL NOT NULL,
      avatar VARCHAR,
      created_at TIMESTAMP
      )`);

  const formattedUsersData = formattedData(usersData);

  await db.query(
    format(
      `INSERT INTO users(
      first_name, surname, email ,
      phone_number, is_host, avatar
      ) VALUES %L`,
      formattedUsersData
    )
  );
}

module.exports = seed;
