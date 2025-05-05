const Follow = require("../models/follow-model");
const Post = require("../models/post-model");
const User = require("../models/user-model");
const WebSocketService = require("../services/web-socket-service");
const post = new Post();
const follow = new Follow()
const user = new User();

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
      const userData = await user.findById(userId)
      const result = await post.commentOnPost({postId, userId, comment});
      const postDetails = await post.fetchPost(postId);
      const userIds = result.map((item) => item.user_id);
      const followers = await follow.findFollowersOfUser(userId)
      const followerIds = followers.map((item) => item.id)
      WebSocketService.sendNotification(userIds, {
        type: "comment",
        message: "A user replied to the same post where you left a comment.",
      });
      WebSocketService.sendNotification(followerIds, {
        type: "comment",
        message: `${userData.name} added a comment on a post`,
      });
      WebSocketService.sendNotification([postDetails.user_id], {
        type: "comment",
        message: `${userData.name} commented on your post`,
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
      const userData = await user.findById(userId)
      const result = await post.likePost({postId, userId});
      const postDetails = await post.fetchPost(postId);
      const userIds = result.map((item) => item.user_id);
      const followers = await follow.findFollowersOfUser(userId);
      const followerIds = followers.map((item) => item.id);
      WebSocketService.sendNotification(userIds, {
        type: "like",
        message: "A user liked the same post where you left a like.",
      });
      WebSocketService.sendNotification(followerIds, {
        type: "like",
        message: `${userData.name} liked a post`,
      });
      WebSocketService.sendNotification([postDetails.user_id], {
        type: "like",
        message: `${userData.name} liked your post`
      })
      res.send({ postDetails });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = PostController;
