const express = require('express');
const router = express.Router();
const ticketController = require('./../controllers/ticketController');
const adminAuthController = require('./../controllers/adminAuthController');
const authController = require('./../controllers/authController')
const upload = require('./../multerConfig');

router.route('/createTicket').post(authController.protect,upload.single('image'), ticketController.createTicket);

router.route('/getAllTickets').get(adminAuthController.protect, ticketController.getAllTickets);

router.route('/getAllTicketsByUsername').get(authController.protect, ticketController.getAllTicketsByUsername);

router.route('/updateStatus').post(adminAuthController.protect, ticketController.updateTicketStatus);

module.exports = router;