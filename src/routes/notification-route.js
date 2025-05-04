const express = require('express');
const NotificationController = require('../controller/notification-controller');

const router = express.Router();
const notificationController = new NotificationController();

router.post("/like", notificationController.likeContent);

module.exports = router;