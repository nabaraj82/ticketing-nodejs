
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

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode ?? 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === "development") {
      devErrors(res, error);
    } else {
        prodError(res, error);
    }
}