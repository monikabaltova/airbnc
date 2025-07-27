const db = require("./connection.js");
const format = require("pg-format");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData,
} = require("./test/index.js");
const {
  formattedData,
  createUserRef,
  createPropertyRef,
  sortPropertiesKeys,
  sortReviewsKeys,
  extractGuestNames,
  splitFullName,
  sortImagesKeys,
  sortBookingsKeys,
} = require("./utils/formatedData.js");

async function insertAllData() {
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

  const { rows: insertedReviews } = await db.query(
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

  const updatedImages = imagesData.map((image) => {
    const updatedImage = { ...image };

    const property_id = propertyRef[image.property_name];
    updatedImage.property_id = property_id;
    delete updatedImage.property_name;

    return updatedImage;
  });

  const formattedImagesData = sortImagesKeys(updatedImages);

  const { rows: insertedImages } = await db.query(
    format(
      `INSERT INTO images(
    property_id, 
    image_url,
    alt_text
    ) VALUES %L RETURNING *;`,
      formattedImagesData
    )
  );
  const updatedFavourites = favouritesData.map((favourit) => {
    const updatedFavourit = { ...favourit };
    const user_id = userRef[favourit.guest_name];
    updatedFavourit.guest_id = user_id;
    delete updatedFavourit.guest_name;

    const property_id = propertyRef[favourit.property_name];
    updatedFavourit.property_id = property_id;
    delete updatedFavourit.property_name;

    return updatedFavourit;
  });
  const formattedFavouritesData = formattedData(updatedFavourites);

  const { rows: insertedFavouries } = await db.query(
    format(
      `
      INSERT INTO favourites(
      guest_id, 
      property_id
      ) VALUES %L RETURNING *;`,
      formattedFavouritesData
    )
  );

  const updatedBookings = bookingsData.map((booking) => {
    const updatedBooking = { ...booking };
    const user_id = userRef[booking.guest_name];
    updatedBooking.guest_id = user_id;
    delete updatedBooking.guest_name;

    const property_id = propertyRef[booking.property_name];
    updatedBooking.property_id = property_id;
    delete updatedBooking.property_name;

    return updatedBooking;
  });
  const formattedBookingsData = sortBookingsKeys(updatedBookings);

  const { rows: insertedBookings } = await db.query(
    format(
      `
      INSERT INTO bookings(
      property_id, 
      guest_id, 
      check_in_date, 
      check_out_date
      ) VALUES %L RETURNING *`,
      formattedBookingsData
    )
  );
  console.log(insertedBookings);
}
module.exports = insertAllData;
