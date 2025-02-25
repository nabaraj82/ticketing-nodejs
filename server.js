const mongoose = require("mongoose");
const cron = require("node-cron");
const Admin = require("./model/adminModel");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const app = require("./app");
const { deleteResolvedTickets } = require("./controllers/ticketController");

const port = process.env.PORT || 4000;
console.log(port);
process.on("uncaughtException", (err, origin) => {
  console.log(err.name, err.message);
  console.log("Application is shutting down...");
  process.exit(1);
});
mongoose
  .connect(process.env.CONN_STR)
  .then((conn) => {
    console.log("DB connection successful");
    checkAndCreateSuperAdmin();
  })
  .catch((err) => console.log(err));


const server = app.listen(port, () => {
  console.log(`Server has started at http://localhost:${port}`);
  if (process.env.NODE_ENV === "production") {
    console.log("Running in production mode");
  } else {
    console.log("Running in development mode");
  }
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

async function checkAndCreateSuperAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const superAdmin = new Admin({
        email: process.env.SUPER_ADMIN_USERNAME,
        role: process.env.ROLE,
        password: process.env.SUPER_ADMIN_PASSWORD,
      });
      await superAdmin.save();
      console.log("Super-admin created successfully");
    } else {
      console.log("Admins already exist. Skipping super-admin creation.");
    }
  } catch (error) {
    console.log(error)
    console.error("Error creating super-admin:");
  }
}

cron.schedule("0 0 * * *", deleteResolvedTickets); // Run every day at midnight
