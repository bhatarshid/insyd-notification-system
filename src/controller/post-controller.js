const Post = require("../models/post-model");
const WebSocketService = require("../services/web-socket-service");
const post = new Post();

class PostController {
  async fetchPosts(req, res) {
    try {
      const postData = await post.fetchPosts();
      res.send({ posts: postData });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
  async createPost(req, res) {
    try {
      const { content, userId } = req.body;
      if (!content || !userId) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const postData = await post.createPost({content, userId});
      res.send({ user: postData });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async commentOnPost(req, res) {
    try {
      const { postId, userId, comment } = req.body;
      if (!postId || !userId || !comment) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const result = await post.commentOnPost({postId, userId, comment});
      const userIds = await result.map((item) => item.user_id);
      WebSocketService.sendNotification(userIds, {
        type: "comment",
        message: "A user replied to the same post where you left a comment.",
      });
      res.send({ user: userIds });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async likePost(req, res) {
    try {
      const { postId, userId } = req.body;
      if (!postId || !userId) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const postData = await post.likePost({postId, userId});
      const userIds = await postData.map((item) => item.user_id);
      WebSocketService.sendNotification(userIds, {
        type: "like",
        message: "A user liked the same post where you left a like.",
      });
      res.send({ user: postData });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = PostController;
