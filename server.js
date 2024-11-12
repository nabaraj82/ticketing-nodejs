const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const app = require("./app");

const port = process.env.PORT || 4001;

process.on("uncaughtException", (err, origin) => {
  console.log(err.name, err.message);
  console.log("Application is shutting down...");
  process.exit(1);
});
mongoose
  .connect(process.env.CONN_STR)
  .then((conn) => {
    console.log("DB connection successful");
  })
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`Server has started at http://localhost:${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
