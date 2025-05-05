const express = require("express");
const UserController = require("../controller/user-controller.js");

const router = express.Router();
const userController = new UserController();

router.get("/", userController.fetchUser);
router.post("/follow", userController.followUser);
router.get("/followers", userController.fetchFollowers )

module.exports = router;
