const express = require("express");
const topicController = require("./../controllers/topicController");
const authController = require("../controllers/autController");
const middlewares = require('../middlewares/protectAdminRoute')

const router = express.Router();

router
  .route("/createTopic")
  .post(middlewares.protectAdmin, topicController.createTopic);
router
  .route("/getAllTopics")
  .get(authController.protect, topicController.getAllTopics);
router
  .route("/getAllTopicsByCategory/:id")
  .get(authController.protect, topicController.getAllTopicsByCategory);
router
  .route("/updateTopic/:id")
  .put(middlewares.protectAdmin, topicController.updateTopic);
router
  .route("/deleteTopic/:id")
  .delete(middlewares.protectAdmin, topicController.deleteTopic);

module.exports = router;
