const db = require("../db/connection");
const { checkExists } = require("./utils");

exports.insertFavourite = async (guest_id, property_id) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property does not exist"
  );

  const { rows } = await db.query(
    `
    INSERT INTO favourites (guest_id, property_id)
    VALUES ($1, $2) RETURNING*;`,
    [guest_id, property_id]
  );

  return rows[0].favourite_id;
};

exports.removeFavourite = async (property_id, guest_id) => {
  await checkExists(
    "properties",
    "property_id",
    property_id,
    "Property does not exist"
  );
  await checkExists("users", "user_id", guest_id, "User does not exist");
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
