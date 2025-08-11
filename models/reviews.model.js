const db = require("../db/connection");

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

exports.insertPropertyReview = async (id, guest_id, rating, comment) => {
  if (
    (guest_id && typeof guest_id !== "number") ||
    (rating && typeof rating !== "number")
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid data type",
    });
  }

  const { rows } = await db.query(
    `INSERT INTO reviews (property_id, guest_id, rating, comment)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
    [id, guest_id, rating, comment]
  );

  return rows[0];
};

exports.removePropertyReview = async (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const { rowCount } = await db.query(
    `
    DELETE from reviews
    WHERE review_id = $1;
    `,
    [id]
  );
  if (!rowCount) return Promise.reject({ status: 404, msg: "Data not found." });

  return;
};
