const express = require("express");
4;
const router = express.Router();

const middlewares = require("../middlewares/protectSuperAdminRoute");
const superAdminController = require("../controllers/superAdminController");

router
  .route("/create/user")
  .post(middlewares.protectSuperAdmin, superAdminController.createUser);
  
router.route('/update/user-password').put(middlewares.protectSuperAdmin, superAdminController.updateUserPassword);

router.route('/delete/user').delete(middlewares.protectSuperAdmin, superAdminController.deleteUser)

module.exports = router;
