const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const morgan = require("morgan");
const globalErrorHandler = require('./controllers/errorController');
const categoryRouter = require('./routes/categoryRoute');
const topicRouter = require('./routes/topicRoute');
const adminAuthRouter = require('./routes/adminAuthRoute');
const ticketRouter = require('./routes/ticketRoute')
const CustomError = require('./utils/CustomError');
let app = express();
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "http://localhost:3039", // Only allow requests from this origin
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Secret-Key"], // Allowed headers
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};
// const corsOptions = {
//   origin: "http://localhost:3039", // Only allow requests from this origin
//   methods: ["*", "PATCH"], // Specify allowed HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization", "Secret-Key"], // Allowed headers
//   credentials: true, // Allow credentials (cookies, HTTP authentication)
//   preflightContinue: false,
// };


app.use("*",cors(corsOptions));


app.use(express.json());


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/topic', topicRouter);
app.use('/api/v1/admin', adminAuthRouter);
app.use('/api/v1/ticket', ticketRouter);

app.all('*', (req, res, next) => {
      const err = new CustomError(
        `Can't find ${req.originalUrl} on the server`,
        404
    );
    next(err);
})

app.use(globalErrorHandler);
module.exports = app;