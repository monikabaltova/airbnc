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
