const mongoose = require("mongoose");
const cron = require("node-cron");
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");
const Admin = require("./model/adminModel");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const app = require("./app");
const { deleteResolvedTickets } = require("./controllers/ticketController");

const port = process.env.PORT || 4001;
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

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const server = app.listen(port, () => {
  console.log(`Server has started at http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
  } else {
    console.log('Running in development mode');
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
        username: "admin",
        role: ["superadmin"],
        password: "123456",
      });
      await superAdmin.save();
      console.log("Superadmin created successfully");
    } else {
      console.log("Admins already exist. Skipping superadmin creation.");
    }
  } catch (error) {
    console.error("Error creating superadmin:", err);
  }
}

cron.schedule('*/2 * * * *', deleteResolvedTickets);  // Run every day at midnight
