const express = require("express");
const adminAuthController = require('./../controllers/adminAuthController')
const categoryController = require("./../controllers/categoryController");
const router = express.Router();

router
  .route("/createCategory")
  .post(adminAuthController.protect, categoryController.createCategory);
router
  .route("/getAllCategories")
  .get(adminAuthController.protect, categoryController.getAllCategory);

router
  .route("/updateCategory/:id")
  .put(adminAuthController.protect, categoryController.updateCategory);
// router.route("/updateCategory/:categoryId/topics/:topicId").patch(authController.protect, categoryController.updateTopics);
// router.route("/addTopics/:categoryId").post(authController.protect, categoryController.addTopic);
router
  .route("/deleteCategory/:id")
  .delete(adminAuthController.protect, categoryController.deleteCategory);
// router.route("/deleteTopic/:categoryId/Topic/:topicId").delete(authController.protect, categoryController.deleteTopic);


module.exports = router;
  