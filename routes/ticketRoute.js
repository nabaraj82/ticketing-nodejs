const express = require("express");
const router = express.Router();
const ticketController = require("./../controllers/ticketController");
const authController = require("../controllers/authController");
const upload = require("./../multerConfig");
const middlewares = require("../middlewares/protectTicketRoute");

router
  .route("/createTicket")
  .post(
    middlewares.protect,
    upload.array("images", 3),
    ticketController.createTicket
  );
// router.route('/createTicket').post(authController.protect,ticketController.createTicket);
router
  .route("/updateTicket")
  .put(
    middlewares.protect,
    upload.array("images", 3),
    ticketController.updateTicketByUser
  );
router
  .route("/getAllTickets")
  .get(authController.protect, ticketController.getAllTickets);

router
  .route("/getAllTicketsByUsername/:id")
  .get(middlewares.protect, ticketController.getAllTicketsByUsername);

router
  .route("/updateStatus")
  .post(authController.protect, ticketController.updateTicketStatus);

module.exports = router;
