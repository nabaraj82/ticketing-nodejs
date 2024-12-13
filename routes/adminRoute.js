const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const middlewares = require("../middlewares/protectAdminRoute");

router
  .route("/create/user")
  .post(middlewares.protectAdmin, adminController.createUser);
router
  .route("/update/user-password")
  .put(middlewares.protectAdmin, adminController.updateUserPassword);

router
  .route("/delete/user")
  .delete(middlewares.protectAdmin, adminController.deleteUser);

module.exports = router;
