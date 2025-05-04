const Follow = require("../models/follow-model");
const follow = new Follow();

class NotificationController {
  async likeContent (req, res) {
    try {
      const userId = req.body.userId;
      const followers = await follow.findFollowersOfUser(userId);
      res.send({followers})
    }
    catch (error) {
      console.error("Error liking content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = NotificationController;