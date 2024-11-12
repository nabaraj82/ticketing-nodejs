const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const adminController = require('./../controllers/adminController');

router.route('/getAllTickets').get(authController.protect, adminController.getAllTickets);

module.exports = router;