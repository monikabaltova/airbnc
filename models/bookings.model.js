const db = require("../db/connection");

exports.fetchBookings = async (property_id) => {
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
  await db.query(
    `
        DELETE FROM bookings 
        WHERE booking_id = $1
        `,
    [booking_id]
  );

  return;
};
