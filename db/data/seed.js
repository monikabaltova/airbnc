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
  await db.query(`DROP TABLE IF EXISTS properties`);
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`DROP TABLE IF EXISTS property_types`);

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
      user_id SERIAL PRIMARY KEY,
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

  await db.query(`CREATE TABLE properties(
   property_id SERIAL PRIMARY KEY,
   host_id INT NOT NULL REFERENCES users(user_id),
   name VARCHAR NOT NULL,
   location VARCHAR NOT NULL,
   property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
   price_per_night FLOAT(2) NOT NULL,
   description TEXT
   )`);

  const formattedPropertiesData = formattedData(propertiesData);
  await db.query(
    format(
      `INSERT INTO properties(
   name,
   property_type,
     location,
   price_per_night,
   description,
   
      ) VALUES %L`,
      formattedPropertiesData
    )
  );
  console.log("working");
}

module.exports = seed;
