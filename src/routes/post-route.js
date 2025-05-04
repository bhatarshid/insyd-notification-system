const express = require("express");
const PostController = require("../controller/post-controller.js");

const router = express.Router();
const postController = new PostController();

router.get("/", postController.fetchPosts);
router.post("/create", postController.createPost);
router.post("/comment", postController.commentOnPost);

module.exports = router;
