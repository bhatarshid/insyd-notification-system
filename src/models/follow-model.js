const db = require("../db/database");

class Follow {
  async create({ followerId, followeeId }) {
    const result = await db.run(
      "INSERT INTO follows (follower_id, followee_id, created_at) VALUES (?, ?, ?)",
      [followerId, followeeId, new Date().toISOString()]
    );
    return result.lastID;
  }

  async findFollowersOfUser(userId) {
    const query = `
      SELECT u.* FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.followee_id = ?
    `;
    const result = await db.query(query, [userId]);
    console.log(result)
    return result;
  }
}

module.exports = Follow;