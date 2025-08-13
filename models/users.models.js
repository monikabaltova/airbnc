const db = require("../db/connection");

exports.fetchUserById = async (id) => {
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
