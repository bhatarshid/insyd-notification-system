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

    for (const post of posts) {
      const comments = await db.query(`
        SELECT comments.comment, comments.user_id, users.name AS commenter_name 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.post_id = ?
      `, [post.id]);
      post.comments = comments;

      const likes = await db.query(`
        SELECT likes.user_id, users.name AS liker_name, users.email AS liker_email 
        FROM likes 
        JOIN users ON likes.user_id = users.id 
        WHERE likes.post_id = ?
      `, [post.id]);
      post.likes = likes;
      post.like_count = likes.length;
    }
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
    const likes = await db.query(
      "SELECT user_id FROM likes WHERE post_id = ? and post_id != ?",
      [postId, result.lastID]
    );
    return likes;
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
