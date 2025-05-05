const db = require("../db/database");

class User {
  async create({ username, email }) {
    const result = await db.run(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email]
    );
    return result.lastID;
  }

  async findByEmail(email) {
    const users = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return users[0];
  }

  async findById(id) {
    const users = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return users[0];
  }

  async updateLastActive(userId) {
    await db.run(
      "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?",
      [userId]
    );
  }
}

module.exports = User;
