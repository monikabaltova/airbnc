const db = require("./connection");

async function createAllTables() {
  await db.query(`CREATE TABLE property_types(
    property_type VARCHAR NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
    )`);

  await db.query(`CREATE TABLE users(
      user_id SERIAL PRIMARY KEY,
      first_name VARCHAR NOT NULL,
      surname VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone_number VARCHAR,
      is_host BOOL NOT NULL,
      avatar VARCHAR,
      created_at TIMESTAMP DEFAULT NOW()
      )`);

  await db.query(`CREATE TABLE properties(
   property_id SERIAL PRIMARY KEY,
   host_id INT REFERENCES users(user_id) NOT NULL,
   name VARCHAR NOT NULL,
   location VARCHAR NOT NULL,
   property_type VARCHAR REFERENCES property_types(property_type) NOT NULL,
   price_per_night FLOAT(2) NOT NULL,
   description TEXT
   )`);

  await db.query(`CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(property_id) NOT NULL,
    guest_id INT REFERENCES users(user_id) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    )`);

  await db.query(`CREATE TABLE images(
    image_id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(property_id) NOT NULL,
    image_url VARCHAR NOT NULL,
    alt_text VARCHAR NOT NULL
  )`);

  await db.query(`CREATE TABLE favourites(
    favourite_id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES users(user_id) NOT NULL,
    property_id INT REFERENCES properties(property_id) NOT NULL
  )`);

  await db.query(`CREATE TABLE bookings(
    booking_id SERIAL PRIMARY KEY,
    property_id INT REFERENCES properties(property_id) NOT NULL,
    guest_id INT REFERENCES users(user_id) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`);
}

module.exports = createAllTables;
