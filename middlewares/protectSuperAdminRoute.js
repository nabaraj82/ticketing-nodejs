const asyncErrorHandler = require("../utils/asyncErrorHandler");
const Admin = require("../model/adminModel");
const CustomError = require("../utils/CustomError");
const util = require('util')
const jwt = require("jsonwebtoken");


exports.protectSuperAdmin = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new CustomError("token required", 401));
    return;
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
    return next(new CustomError("token version invalid", 401));
    }
    
    if (admin.role !== 'super-admin') {
            return next(new CustomError("you are not authorized to access", 401));
    }
     req.admin = admin;
     next();
});
