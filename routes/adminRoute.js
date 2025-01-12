const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const middlewares = require("../middlewares/protectAdminRoute");
const authController = require('../controllers/authController');
router
  .route("/create/user")
  .post(middlewares.protectAdmin, adminController.createUser);

  router.route("/users").get(authController.protect, adminController.fetchAllUsers)
router
  .route("/update/user-password")
  .put(middlewares.protectAdmin, adminController.updateUserPassword);

router.route("/updateEmailAlert/:id").put(middlewares.protectAdmin, adminController.emailAlertUpdate);

router
  .route("/delete/user/:id")
  .delete(middlewares.protectAdmin, adminController.deleteUser);

module.exports = router;
