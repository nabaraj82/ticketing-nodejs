const express = require('express');
const morgan = require("morgan");
const globalErrorHandler = require('./controllers/errorController');
const adminRouter = require('./routes/adminRoute');
let app = express();
app.use(express.json());


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use('/api/v1/admin', adminRouter);

app.use(globalErrorHandler);
module.exports = app;