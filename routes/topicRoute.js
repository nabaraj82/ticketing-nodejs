const express = require("express");
const topicController = require("./../controllers/topicController");
const adminAuthController = require("./../controllers/adminAuthController");

const router = express.Router();

router
  .route("/createTopic")
  .post(adminAuthController.protect, topicController.createTopic);
router
  .route("/getAllTopics")
  .get(adminAuthController.protect, topicController.getAllTopics);
router
  .route("/getAllTopicsByCategory/:id")
  .get(adminAuthController.protect, topicController.getAllTopicsByCategory);
router
  .route("/updateTopic/:id")
  .put(adminAuthController.protect, topicController.updateTopic);
router
  .route("/deleteTopic/:id")
  .delete(adminAuthController.protect, topicController.deleteTopic);

module.exports = router;
