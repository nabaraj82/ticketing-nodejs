const Ticket = require("../model/ticketModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const randomImageName = require("./../utils/randomImageName");
const nodeMailer = require("./../utils/nodeMailer");
const s3 = require("./../aws-config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { response } = require("../app");

exports.createTicket = asyncErrorHandler(async (req, res, next) => {
  const imageNames = [];
  if (req.files.length > 0) {
    for (const file of req.files) {
      const imageName = randomImageName();
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const putCommand = new PutObjectCommand(params);
      await s3.send(putCommand);
      imageNames.push(imageName);
    }

    const newTicket = new Ticket({
      name: req.body.name,
      username: req.body.username,
      mobileNo: req.body.mobileNo,
      category: req.body.category,
      // topic: req.body.topic,
      description: req.body.description,
      imageNames: imageNames,
    });
    const savedTicket = await newTicket.save();

    const imageUrls = [];

    for (const imageName of savedTicket.imageNames) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
      imageUrls.push(url);
    }

    const responseTicket = { ...savedTicket.toObject(), imageUrls };
    nodeMailer(responseTicket);

    res.status(201).json({
      status: "success",
      message: "New ticket created successfully",
      data: {
        ticket: responseTicket,
      },
    });
  } else {
    const newTicket = new Ticket({
      name: req.body.name,
      username: req.body.username,
      mobileNo: req.body.mobileNo,
      category: req.body.category,
      // topic: req.body.topic,
      description: req.body.description,
      imageNames: [],
    });
    const savedTicket = await newTicket.save();
    nodeMailer(savedTicket);
    res.status(201).json({
      status: "success",
      message: "New ticket created successfully",
      data: {
        ticket: savedTicket,
      },
    });
  }
});

exports.updateTicketByUser = asyncErrorHandler(async (req, res, next) => {
  const ticketToUpdate = await Ticket.findById(req.body.id);
  if (!ticketToUpdate) {
    res.status(200).json({
      status: "success",
      message: "Ticket does not exits.",
    });
    return;
  }
  if (ticketToUpdate.status !== "pending") {
    res.status(200).json({
      status: "success",
      message: "The update cannot be made as it is already in progress.",
    });
    return;
  }
  const newImageNames = [];
  let newTicketObject = {};
  const imageUrls = [];

  if (req.body.imageNames?.length > 0) {
    const imageNames = req.body.imageNames;
    for (const imageName of imageNames) {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
      };

      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }
  }
  if (req.files.length > 0) {
    for (const file of req.files) {
      const imageName = randomImageName();
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      newImageNames.push(imageName);
    }
  }

  newTicketObject.category = req.body.category;
  newTicketObject.topic = req.body.topic;
  newTicketObject.description = req.body.description;
  newTicketObject.imageNames = newImageNames;

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.body.id,
    newTicketObject,
    { new: true }
  );

  for (const imageName of updatedTicket.imageNames) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    imageUrls.push(url);
  }
  const responseTicket = { ...updatedTicket.toObject(), imageUrls };

  res.status(200).json({
    status: "success",
    message: "ticket updated successfully",
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
      data: [],
    });
  }
  const responseTickets = [];
  for (const ticket of tickets) {
    const imageUrls = [];
    for (imageName of ticket.imageNames) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
      imageUrls.push(url);
    }

    const originalObject = ticket.toObject();
    delete originalObject.imageNames;
    const ticketObj = { ...originalObject, imageUrls };
    responseTickets.push(ticketObj);
  }

  res.status(200).json({
    status: "success",
    data: {
      tickets: responseTickets,
    },
  });
});

exports.getAllTicketsByUsername = asyncErrorHandler(async (req, res, next) => {
  const tickets = await Ticket.find({ username: req.params.id }).sort({createdAt: -1});
  if (tickets.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No ticket has been created",
      data: [],
    });
  }

  const responseTickets = [];
  for (const ticket of tickets) {
    const imageUrls = [];
    for (imageName of ticket.imageNames) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
      imageUrls.push(url);
    }

    const originalObject = ticket.toObject();
    // delete originalObject.imageNames;
    const ticketObj = { ...originalObject, imageUrls };
    responseTickets.push(ticketObj);
  }

  res.status(200).json({
    status: "success",
    data: {
      tickets: responseTickets,
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

  if (updatedTicket.imageNames.length > 0) {
    const imageUrls = [];
    for (imageName of updatedTicket.imageNames) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
      };

      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
      imageUrls.push(url);
    }

    const originalObject = updatedTicket.toObject();
    // delete originalObject.imageNames;

    const updatedResponseTicket = {
      ...originalObject,
      imageUrls,
    };
    res.status(200).json({
      status: "success",
      message: "status updated successfully",
      data: {
        ticket: updatedResponseTicket,
      },
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "status updated successfully",
      data: {
        ticket: updatedTicket,
      },
    });
  }
});

exports.deleteResolvedTickets = asyncErrorHandler(async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  try {
    const ticketsToDelete = await Ticket.find({
      status: "resolved",
      createdAt: { $lt: oneMonthAgo },
    });

    if (ticketsToDelete.length > 0) {
      for (const ticket of ticketsToDelete) {
        if (ticket.imageNames.length > 0) {
          for (const imageName of ticket.imageNames) {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: imageName,
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
          }
        }
      }
    }
    const result = await Ticket.deleteMany({
      status: "resolved",
      createdAt: { $lt: oneMonthAgo },
    });
    console.log(`Deleted ${result.deletedCount} tickets.`);
  } catch (error) {
    console.error("Error deleting tickets:", err);
  }
});
