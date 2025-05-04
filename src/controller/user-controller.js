const User = require("../models/user-model");
const user = new User();

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
}

module.exports = UserController;
