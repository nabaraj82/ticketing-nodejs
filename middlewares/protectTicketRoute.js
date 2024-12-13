const CustomError = require("../utils/CustomError");

exports.protect = (req, res, next) => {
  const secret_key = req.headers["secret-key"];
  if (secret_key === process.env.SECRET_KEY) {
    return next();
  }
  const error = new CustomError("Access Denied", 403);
  next(error);
};
