const express = require("express");
const authController = require("../controllers/authController");
const categoryController = require("./../controllers/categoryController");
const middlewares = require("../middlewares/protectAdminRoute");
const router = express.Router();

router
  .route("/createCategory")
  .post(middlewares.protectAdmin, categoryController.createCategory);
router
  .route("/getAllCategories")
  .get(authController.protect, categoryController.getAllCategory);

router
  .route("/updateCategory/:id")
  .put(middlewares.protectAdmin, categoryController.updateCategory);
// router.route("/updateCategory/:categoryId/topics/:topicId").patch(authController.protect, categoryController.updateTopics);
// router.route("/addTopics/:categoryId").post(authController.protect, categoryController.addTopic);
router
  .route("/deleteCategory/:id")
  .delete(middlewares.protectAdmin, categoryController.deleteCategory);
// router.route("/deleteTopic/:categoryId/Topic/:topicId").delete(authController.protect, categoryController.deleteTopic);

module.exports = router;
