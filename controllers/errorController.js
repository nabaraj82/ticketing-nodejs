const CustomError = require('./../utils/CustomError');
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! please try later.",
    });
  }
};

const duplicateKeyErrorHandler = (error) => {
    let value;
    // console.log(error.keyValue.hasOwnProperty('topics.title'));
    if (error.keyValue.hasOwnProperty("topics.title")) {
      value = error.keyValue["topics.title"];
    } else {
      value = error.keyValue.title;
    }
  const msg = `there is already ${value}. Please use another name!`;
  return new CustomError(msg, 409);
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode ?? 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === "development") {
      devErrors(res, error);
    } else {
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        prodError(res, error);
    }
}