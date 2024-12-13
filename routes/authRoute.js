const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/autController");

router.route("/auth/signIn").post(adminAuthController.signIn);

module.exports = router;
