const db = require("../db/connection");
const { checkExists } = require("./utils");

exports.fetchBookings = async (property_id) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property does not exist"
  );

  const { rows } = await db.query(
    ` SELECT booking_id, 
        check_in_date, 
        check_out_date, 
        created_at
        FROM bookings
        WHERE property_id = $1;
        `,
    [property_id]
  );
  if (!rows.length) {
    return Promise.reject({
      status: 200,
      msg: "This property has no bookings",
    });
  }
  return rows;
};

exports.insertBooking = async (
  property_id,
  guest_id,
  check_in_date,
  check_out_date
) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property does not exist"
  );
  await checkExists("users", "user_id", guest_id, "User does not exist");
  const { rows } = await db.query(
    `
    INSERT INTO bookings
    (property_id, guest_id, check_in_date, check_out_date)
    VALUES ($1, $2, $3, $4) RETURNING*;`,
    [property_id, guest_id, check_in_date, check_out_date]
  );

  return rows[0].booking_id;
};

exports.removeBooking = async (booking_id) => {
  await checkExists(
    "bookings",
    "booking_id",
    booking_id,
    "Booking does not exist"
  );
  await db.query(
    `
        DELETE FROM bookings 
        WHERE booking_id = $1
        `,
    [booking_id]
  );

  return;
};
