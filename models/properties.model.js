const db = require("../db/data/connection");

exports.fetchAllProperties = async (
  sort = "popularity",
  order = "DESC",
  max_price,
  min_price,
  property_type
) => {
  order = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  let sortColumn;
  if (sort === "price_per_night") {
    sortColumn = "price_per_night";
  } else {
    sortColumn = "popularity";
  }

  const values = [];
  const whereConditions = [];
  const whereLine =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  if (!isNaN(min_price)) {
    values.push(min_price);
    whereConditions.push(`price_per_night >= $${values.length}`);
  }

  if (!isNaN(max_price)) {
    values.push(max_price);
    whereConditions.push(`price_per_night <= $${values.length}`);
  }

  if (property_type) {
    const formattedType =
      property_type.charAt(0).toUpperCase() +
      property_type.slice(1).toLowerCase();
    values.push(formattedType);
    whereConditions.push(`property_type = $${values.length}`);
  }

  const { rows } = await db.query(
    `
    SELECT
    properties.property_id,
    name AS property_name,
    location,
    price_per_night,
    CONCAT(first_name, ' ', surname) AS host,
    COUNT(favourites.favourite_id) AS popularity
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON favourites.property_id = properties.property_id
    ${whereLine}
    GROUP BY properties.property_id, name, location, price_per_night, users.first_name, users.surname
    ORDER BY ${sortColumn} ${order}; `,
    values
  );
  console.log(rows);
  return { properties: rows };
};
