const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const xss = require("xss-clean");
const sanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const categoryRouter = require("./routes/categoryRoute");
const topicRouter = require("./routes/topicRoute");
const adminAuthRouter = require("./routes/authRoute");
const ticketRouter = require("./routes/ticketRoute");
const adminRouter = require("./routes/adminRoute");
const CustomError = require("./utils/CustomError");

let app = express();
app.use(cookieParser());
app.use(compression()); //to compress response body to optimize performance
app.use(helmet()); //secure Express apps by setting HTTP response headers.
app.use(sanitize());
app.use(xss());



let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "We have too many requests from this IP. Please try again later.",
});
app.use("/api", limiter);
app.use("/public", express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://admin-ticketing.cellpay.com.np",
    "http://localhost:5173",
    "https://demoapp.cellpay.com.np",
    "https://app.cellpay.com.np",
  ], // Only allow requests from this origin
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Secret-Key",
    "paynet-session-token",
  ], // Allowed headers
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use("*", cors(corsOptions));

app.use(express.json());
app.use(morgan("combined"));

//Ip whilist middleware
app.use((req, res, next) => {
  const clientIp = req.ip.replace(/^::ffff:/, "").replace(/^::/, "");
  if (clientIp !== process.env.WHITELISTED_IP ) {
    return res.status(403).json({
      error: "Access denied",
      message: "Your IP address is not authorized to access this resource",
    });
  }

  next();
});
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/topic", topicRouter);
app.use("/api/v1", adminAuthRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/admin", adminRouter);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
