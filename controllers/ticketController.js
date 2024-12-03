const Ticket = require("../model/ticketModel");
const firebaseAdmin = require('firebase-admin');
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.createTicket = asyncErrorHandler(async (req, res, next) => {
  const imageURL = req.file
    ? `http://localhost:4000/public/images/${req.file.filename}`
    : null;
  const newTicket = new Ticket({
    name: req.body.name,
    username: req.body.username,
    mobileNo: req.body.mobileNo,
    category: req.body.category,
    topic: req.body.topic,
    description: req.body.description,
    imageURL: imageURL,
  });

  // const savedTicket = await newTicket.save();
  // const message = {
  //   notification: {
  //     title: "Issue Raised",
  //     body: "New Ticket has been created",
  //   },
  //   token:
  //     "eBgIm2opEDmvHcIO2FdRxH:APA91bEnYCF9TCQLB_ogUb3V3v0jTrDJ5VGHZe3MeDmM6joKpd8LmgzQfTXPt6GddlYdP6gNnm1SNLc8LzTA9hvNu3DKKf4c8qnKGoPDiIWFkZaFd77Q7qg",
  // };
  // firebaseAdmin
  //   .messaging()
  //   .send(message)
  //   .then((response) => {
  //     // Response is a message ID string.
  //     console.log("Successfully sent message:", response);
  //   })


  res.status(201).json({
    status: "success",
    message: "New ticket created successfully",
    data: {
      ticket: savedTicket,
    },
  });
});

exports.getAllTickets = asyncErrorHandler(async (req, res, next) => {
  const tickets = await Ticket.find().select('-__v').sort({createdAt: -1});
  res.status(200).json({
    status: "success",
    data: {
      tickets,
    },
  });
});

exports.getAllTicketsByUsername = asyncErrorHandler(async (req, res, next) => {
  const tickets = await Ticket.find({ username: req.headers['username'] });
  if (tickets.length > 0) {
    res.status(200).json({
      status: "success",
      data: {
        tickets,
      }
    })
  } else {
    res.status(200).json({
      status: "success", 
      message: "Tickets not found with given username",
      data: []
    })
  }
})

exports.updateTicketStatus = asyncErrorHandler(async (req, res, next) => {
    const { id, toStatus } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(id, { status: toStatus }, { new: true });

    if (!updatedTicket) {
        const error = new CustomError('Topic does not exist', 404);
        return next(error);
    }

    res.status(200).json({
        status: "success",
        message: "status updated successfully",
        data: {
            ticket: updatedTicket
        }
    })
   

})
