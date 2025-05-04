const db = require("../db/database");

class Notification {
  static async create({ userId, type, content }) {
    const result = await db.run(
      "INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)",
      [userId, type, JSON.stringify(content)]
    );
    return result.lastID;
  }

  static async findByUserId(userId, { limit = 20, unread = false } = {}) {
    let query = "SELECT * FROM notifications WHERE user_id = ?";
    const params = [userId];

    if (unread) {
      query += " AND is_read = FALSE";
    }

    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);

    return await db.query(query, params);
  }

  static async markAsRead(notificationIds) {
    if (!notificationIds.length) return;

    const placeholders = notificationIds.map(() => "?").join(",");
    await db.run(
      `UPDATE notifications SET is_read = TRUE WHERE id IN (${placeholders})`,
      notificationIds
    );
  }

  static async getUnreadCount(userId) {
    const result = await db.query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );
    return result[0].count;
  }
}

module.exports = Notification;
