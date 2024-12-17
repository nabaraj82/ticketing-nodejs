const express = require("express");
const topicController = require("./../controllers/topicController");
const authController = require("../controllers/authController");
const middlewaresAdmin = require("../middlewares/protectAdminRoute");
const middlewaresTicket = require("../middlewares/protectTicketRoute");

const router = express.Router();

router
  .route("/createTopic")
  .post(middlewaresAdmin.protectAdmin, topicController.createTopic);
router
  .route("/getAllTopics")
  .get(authController.protect, topicController.getAllTopics);
router
  .route("/user/getAllTopics")
  .get(middlewaresTicket.protect, topicController.getAllTopics);
router
  .route("/getAllTopicsByCategory/:id")
  .get(authController.protect, topicController.getAllTopicsByCategory);
router
  .route("/updateTopic/:id")
  .put(middlewaresAdmin.protectAdmin, topicController.updateTopic);
router
  .route("/deleteTopic/:id")
  .delete(middlewaresAdmin.protectAdmin, topicController.deleteTopic);

module.exports = router;
