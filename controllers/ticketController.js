const Ticket = require("../model/ticketModel");
const firebaseAdmin = require("firebase-admin");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const randomImageName = require("./../utils/randomImageName");
const s3 = require("./../aws-config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const generateSignedUrlsForTickets = require("../utils/generateSignedUrlsForTickets");

exports.createTicket = asyncErrorHandler(async (req, res, next) => {
  // const imageURL = req.file
  //   ? `http://localhost:4000/public/images/${req.file.filename}`
  //   : null;

  const imageName = randomImageName();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const putCommand = new PutObjectCommand(params);
  await s3.send(putCommand);
  const newTicket = new Ticket({
    name: req.body.name,
    username: req.body.username,
    mobileNo: req.body.mobileNo,
    category: req.body.category,
    topic: req.body.topic,
    description: req.body.description,
    imageName: imageName,
  });
  const savedTicket = await newTicket.save();

  const getObjectParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: savedTicket.imageName,
  };

  const getCommand = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  const responseTicket = { ...savedTicket.toObject(), imageURL: url };
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
      ticket: responseTicket,
    },
  });
});

exports.getAllTickets = asyncErrorHandler(async (req, res, next) => {
  const tickets = await Ticket.find().select("-__v").sort({ createdAt: -1 });
  if (!tickets) {
    return res.status(200).json({
      status: "success",
      message: "No ticket has been created",
      data: []
    });
  }
  const responseTickets = [];
  for (const ticket of tickets) {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: ticket.imageName
    }
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
    const ticketObj = { ...ticket.toObject(), imageURL: url };
    responseTickets.push(ticketObj)
  }

  res.status(200).json({
    status: "success",
    data: {
      tickets: responseTickets
    },
  });
});

exports.getAllTicketsByUsername = asyncErrorHandler(async (req, res, next) => {
  const tickets = await Ticket.find({ username: req.headers["username"] });
  if (tickets.length <= 0) {
    return res.status(200).json({
      status: "success",
      message: "No ticket has been created",
      data: []
    })
  }
  
  const responseTickets = [];
  for (const ticket of tickets) {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: ticket.imageName
    }
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
    const ticketObj = { ...ticket.toObject(), imageURL: url };
    responseTickets.push(ticketObj)
  }

  res.status(200).json({
    status: "success",
    data: {
      tickets: responseTickets
    },
  });
});

exports.updateTicketStatus = asyncErrorHandler(async (req, res, next) => {
  const { id, toStatus } = req.body;
  const updatedTicket = await Ticket.findByIdAndUpdate(
    id,
    { status: toStatus },
    { new: true }
  );

  if (!updatedTicket) {
    const error = new CustomError("ticket does not exist", 404);
    return next(error);
  }

  const getObjectParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: updatedTicket.imageName,
  }

  const getCommand = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
  const updatedResponseTicket = { ...updatedTicket.toObject(), imageURL: url };

  res.status(200).json({
    status: "success",
    message: "status updated successfully",
    data: {
      ticket: updatedResponseTicket,
    },
  });
});

exports.deleteResolvedTickets = asyncErrorHandler(async () => {
   const oneMonthAgo = new Date();
   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  try {
    const ticketsToDelete = await Ticket.find({
      status: "resolved",
      createdAt: {$lt: oneMonthAgo}
    });

    if (ticketsToDelete.length > 0) {
      for (const ticket of ticketsToDelete) {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: ticket.imageName,
        };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
      }
    }
    const result = await Ticket.deleteMany({
      status: "resolved",
      createdAt: { $lt: oneMonthAgo}
    });
    console.log(`Deleted ${result.deletedCount} tickets.`);
  } catch (error) {
    console.error("Error deleting tickets:", err);
  }
})

