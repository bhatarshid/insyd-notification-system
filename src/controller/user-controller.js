const Follow = require("../models/follow-model");
const User = require("../models/user-model");
const user = new User();
const follow = new Follow();

class UserController {
  async fetchUser(req, res) {
    try {
      const userData = await user.findByEmail(req.query.email);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      res.send({ user: userData });
    } catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async followUser (req, res) {
    try {
      const result = await follow.create({
        followerId: req.body.followerId,
        followeeId: req.body.followeeId,
      });
      res.status(200).send({message: 'You are now following'})
    }
    catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async fetchFollowers (req, res) {
    try {
      const result = await follow.findFollowersOfUser(req.query.userId);
      res.status(200).send({ data: result })
    }
    catch (error) {
      console.error("Error user: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = UserController;
