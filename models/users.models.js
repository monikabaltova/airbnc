const db = require("../db/data/connection");

exports.fetchUserById = async (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const { rows } = await db.query(
    `
    SELECT * FROM users
    WHERE user_id = $1;`,
    [id]
  );

  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }

  return rows[0];
};
