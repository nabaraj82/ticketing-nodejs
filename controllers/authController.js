const Admin = require("../model/adminModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const util = require("util");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const generateToken = require("../utils/generateToken");
const tokenResponse = require("../utils/tokenResponse");
exports.signIn = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic")) {
    const error = new CustomError(
      "Authorization header is missing or invalid",
      404
    );
    return next(error);
  }
  const base64Credentials = authHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );

  const [username, password] = decodedCredentials.split(":");

  const admin = await Admin.findOne({ email: username }).select("+password");
  if (!admin || !(await admin.comparePasswordInDb(password, admin.password))) {
    const error = new CustomError("Incorrect username or password", 400);
    return next(error);
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    admin._id,
    { $inc: { tokenVersion: 1 } },
    { new: true }
  );

  const token = generateToken(
    updatedAdmin._id,
    updatedAdmin.role,
    updatedAdmin.tokenVersion
  );
  tokenResponse(200, "LoggedIn successfully.", token, res, updatedAdmin);
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new CustomError("Invalid Token", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );

  const admin = await Admin.findById(decodedToken.id);
  if (!admin) {
    const error = new CustomError(
      "The admin with given token does not exist",
      401
    );
    return next(error);
  }

  if (admin.tokenVersion !== decodedToken.tokenVersion) {
    return next(new CustomError("Token version is invalid", 401));
  }
  req.admin = admin;
  next();
});


