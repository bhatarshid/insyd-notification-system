const db = require("../db/database");

class Post {
  async createPost({ content, userId }) {
    const result = await db.run(
      "INSERT INTO posts (content, user_id) VALUES (?, ?)",
      [content, userId]
    );
    return result.lastID;
  }

  async fetchPosts() {
    const posts = await db.query(`
      SELECT posts.*, users.name AS user_name, users.email AS user_email 
      FROM posts 
      JOIN users ON posts.user_id = users.id
    `);
    return posts;
  }

  async findPostById(id) {
    const posts = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
    return posts[0];
  }

  async likePost({ postId, userId }) {
    const result = await db.run(
      "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
      [postId, userId]
    );
    return result.lastID;
  }

  async commentOnPost({ postId, userId, comment }) {
    const result = await db.run(
      "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
      [postId, userId, comment]
    );
    const comments = await db.query(
      "SELECT user_id FROM comments WHERE post_id = ? and post_id != ?",
      [postId, result.lastID]
    );
    return comments;
  }
}

module.exports = Post;
