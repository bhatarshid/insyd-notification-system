const express = require("express");
const UserController = require("../controller/user-controller.js");

const router = express.Router();
const userController = new UserController();

router.get("/", userController.fetchUser);

module.exports = router;
