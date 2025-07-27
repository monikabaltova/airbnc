const db = require("./connection.js");
const format = require("pg-format");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
} = require("./test/index.js");
const {
  formattedData,
  createUserRef,
  createPropertyRef,
  sortPropertiesKeys,
  sortReviewsKeys,
  extractGuestNames,
  splitFullName,
} = require("./utils/formatedData.js");

async function seed() {
  await db.query(`DROP TABLE IF EXISTS reviews`);
  await db.query(`DROP TABLE IF EXISTS properties`);
  await db.query(`DROP TABLE IF EXISTS property_types`);
  await db.query(`DROP TABLE IF EXISTS users`);

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

  const formattedPropertyData = formattedData(propertyTypesData);

  await db.query(
    format(
      `INSERT INTO property_types(property_type, description ) 
    VALUES %L RETURNING *`,
      formattedPropertyData
    )
  );

  const uniqueGuestNames = extractGuestNames(reviewsData);
  const userFullNames = usersData.map(
    (user) => `${user.first_name} ${user.surname}`
  );
  const missingGuests = uniqueGuestNames.filter(
    (guestName) => !userFullNames.includes(guestName)
  );
  const extraUsers = missingGuests.map((guestName) => {
    const { first_name, surname } = splitFullName(guestName);
    return {
      first_name,
      surname,
      email: `${first_name.toLowerCase()}.${surname.toLowerCase()}@example.com`,
      phone_number: null,
      is_host: false,
      avatar: null,
    };
  });

  const fullUsersData = usersData.concat(extraUsers);

  const formattedUsersData = formattedData(fullUsersData);

  const { rows: insertedUsers } = await db.query(
    format(
      `INSERT INTO users(
      first_name, surname, email ,
      phone_number, is_host, avatar
      ) VALUES %L RETURNING *`,
      formattedUsersData
    )
  );

  const userRef = createUserRef(insertedUsers);

  const updatedProperties = propertiesData.map((property) => {
    const updatedProperty = { ...property };
    const user_id = userRef[property.host_name];
    updatedProperty.host_id = user_id;
    delete updatedProperty.host_name;

    return updatedProperty;
  });

  const formattedPropertiesData = sortPropertiesKeys(updatedProperties);

  const { rows: insertedProperties } = await db.query(
    format(
      `INSERT INTO properties(
      host_id,
      name,
      location,
      property_type,
      price_per_night,
      description
      ) VALUES %L RETURNING *;`,
      formattedPropertiesData
    )
  );
  const propertyRef = createPropertyRef(insertedProperties);

  const updatedReviews = reviewsData.map((review) => {
    const updatedReview = { ...review };
    const user_id = userRef[review.guest_name];
    updatedReview.guest_id = user_id;
    delete updatedReview.guest_name;

    const property_id = propertyRef[review.property_name];
    updatedReview.property_id = property_id;
    delete updatedReview.property_name;

    return updatedReview;
  });

  const formattedReviewsData = sortReviewsKeys(updatedReviews);

  const { rows } = await db.query(
    format(
      `INSERT INTO reviews(
    property_id,
    guest_id,
    rating,
    comment,
    created_at 
      ) VALUES %L RETURNING *`,
      formattedReviewsData
    )
  );
  console.log(rows);
}

module.exports = seed;
