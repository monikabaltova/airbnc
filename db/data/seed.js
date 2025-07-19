const db = require("./connection.js");
const format = require("pg-format");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
} = require("./test/index.js");
const { arrayPropertyData, arrayUserData } = require("./utils/formatedData.js");

async function seed() {
  await db.query(`DROP TABLE IF EXISTS property_types`);
  await db.query(`DROP TABLE IF EXISTS users`);

  await db.query(`CREATE TABLE property_types(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
    )`);

  const formattedPropertyData = arrayPropertyData(propertyTypesData);
  await db.query(
    format(
      `INSERT INTO property_types(property_type, description ) 
    VALUES %L`,
      formattedPropertyData
    )
  );
  console.log("please work");

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

  const formattedUsersData = arrayUserData(usersData);

  await db.query(
    format(
      `INSERT INTO users(user_id,
      first_name, surname, email ,
      phone_number, is_host, avatar,
      created_at )`,
      usersData
    )
  );

  console.log("give me this");
}

module.exports = seed;
