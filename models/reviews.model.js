const db = require("../db/data/connection");

exports.fetchPropertyReviews = async (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const { rows } = await db.query(
    `
    SELECT 
    review_id,
    comment,
    rating,
    reviews.created_at,
    CONCAT(first_name,' ',surname) AS guest,
    avatar AS guest_avatar
    FROM reviews
    JOIN properties ON reviews.property_id = properties.property_id
    JOIN users ON reviews.guest_id = users.user_id
    WHERE properties.property_id = $1
    ORDER BY reviews.created_at DESC; 
    `,
    [id]
  );

  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "This property has no reviews !",
    });
  }

  let avgRating = 0;
  for (const review of rows) {
    avgRating += review.rating;
  }
  avgRating = Number((avgRating / rows.length).toFixed(1));

  return [rows, avgRating];
};
