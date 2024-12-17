const express = require("express");
const authController = require("../controllers/authController");
const categoryController = require("./../controllers/categoryController");
const middlewaresAdmin = require("../middlewares/protectAdminRoute");
const middlewaresTicket = require("../middlewares/protectTicketRoute")
const router = express.Router();

router
  .route("/createCategory")
  .post(middlewaresAdmin.protectAdmin, categoryController.createCategory);
router
  .route("/getAllCategories")
  .get(authController.protect, categoryController.getAllCategory);
router
  .route("/user/getAllCategories")
  .get(middlewaresTicket.protect, categoryController.getAllCategory); // for user
router
  .route("/updateCategory/:id")
  .put(middlewaresAdmin.protectAdmin, categoryController.updateCategory);
// router.route("/updateCategory/:categoryId/topics/:topicId").patch(authController.protect, categoryController.updateTopics);
// router.route("/addTopics/:categoryId").post(authController.protect, categoryController.addTopic);
router
  .route("/deleteCategory/:id")
  .delete(middlewaresAdmin.protectAdmin, categoryController.deleteCategory);
// router.route("/deleteTopic/:categoryId/Topic/:topicId").delete(authController.protect, categoryController.deleteTopic);

module.exports = router;
