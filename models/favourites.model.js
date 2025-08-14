const db = require("../db/connection");

exports.insertFavourite = async (guest_id, property_id) => {
  const { rows } = await db.query(
    `
    INSERT INTO favourites (guest_id, property_id)
    VALUES ($1, $2) RETURNING*;`,
    [guest_id, property_id]
  );
  return rows[0].favourite_id;
};

exports.removeFavourite = async (property_id, guest_id) => {
  const { rows } = await db.query(
    `DELETE FROM favourites
    WHERE  
    property_id = $1 AND
    guest_id = $2;
    `,
    [property_id, guest_id]
  );
  return;
};
