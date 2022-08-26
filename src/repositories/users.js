const pool = require("../db/pool");

class UserRepo {
  // return a specified by id user
  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE users.id = $1;`,
      [id]
    );

    return rows;
  }
  // return a specified by email user
  static async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE users.email = $1;`,
      [email]
    );

    return rows;
  }
  // insert a user and return their info
  static async insert(username, password, email) {
    const { rows } = await pool.query(
      "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *;",
      [username, password, email]
    );

    return rows;
  }
}

module.exports = UserRepo;
