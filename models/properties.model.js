const db = require("../db/data/connection");

exports.fetchAllProperties = async (
  sort = "popularity",
  order = "DESC",
  max_price,
  min_price,
  property_type,
  host_id
) => {
  order = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortColumn =
    sort === "price_per_night" ? "price_per_night" : "popularity";

  const values = [];
  const whereConditions = [];

  if (min_price !== undefined) {
    const min = Number(min_price);
    if (Number.isNaN(min)) {
      return Promise.reject({ status: 400, msg: "Bad request: invalid data" });
    }
    values.push(min);
    whereConditions.push(`properties.price_per_night >= $${values.length}`);
  }

  if (max_price !== undefined) {
    const max = Number(max_price);
    if (Number.isNaN(max)) {
      return Promise.reject({ status: 400, msg: "Bad request: invalid data" });
    }
    values.push(max);
    whereConditions.push(`properties.price_per_night <= $${values.length}`);
  }

  if (property_type) {
    const formattedType =
      property_type.charAt(0).toUpperCase() +
      property_type.slice(1).toLowerCase();
    values.push(formattedType);
    whereConditions.push(`property_type = $${values.length}`);
  }

  if (host_id !== undefined) {
    const host = Number(host_id);
    if (Number.isNaN(host))
      return Promise.reject({ status: 400, msg: "Bad request: invalid data" });
    values.push(host);
    whereConditions.push(`properties.host_id = $${values.length}`);
  }

  const whereLine =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const { rows } = await db.query(
    `
    SELECT
    properties.property_id,
    name AS property_name,
    location,
    price_per_night,
    CONCAT(first_name, ' ', surname) AS host,
    COUNT(favourites.favourite_id) AS popularity,
    img.image_url AS image
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON favourites.property_id = properties.property_id
    LEFT JOIN Lateral (
      SELECT image_url
      FROM images
      WHERE images.property_id = properties.property_id
      ORDER BY image_id
      LIMIT 1
      ) img ON true
    ${whereLine}
    GROUP BY properties.property_id, name, location, price_per_night, users.first_name, users.surname, img.image_url
    ORDER BY ${sortColumn} ${order}; `,
    values
  );

  return { properties: rows };
};

exports.fetchPropertiesById = async (id, user_id) => {
  const {
    rows: [property],
  } = await db.query(
    `
    SELECT 
    properties.property_id,
    name AS property_name,
    location,
    price_per_night,
    description,
    CONCAT(first_name, ' ', surname) AS host,
    users.avatar AS host_avatar,
    COUNT(DISTINCT favourites.favourite_id) AS favourite_count,
    ARRAY_AGG(DISTINCT images.image_url) as images
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id
    LEFT JOIN images ON images.property_id = properties.property_id
    WHERE properties.property_id = $1
    GROUP BY 
    properties.property_id, 
    name, 
    location, 
    price_per_night, 
    description, 
    users.first_name, 
    users.surname, 
    users.avatar;`,
    [id]
  );

  if (user_id) {
    const { rows: favourited } = await db.query(
      `
      SELECT BOOL_OR(guest_id = $1) AS favourited
      FROM favourites
      WHERE guest_id = $1 AND property_id = $2;
      `,
      [user_id, id]
    );

    property.favourited = favourited.length > 0;
  }

  return { property: property };
};
