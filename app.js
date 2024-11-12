const express = require('express');
const morgan = require("morgan");

const adminRouter = require('./routes/adminRoute');
let app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use('/api/v1/admin', adminRouter);
module.exports = app;