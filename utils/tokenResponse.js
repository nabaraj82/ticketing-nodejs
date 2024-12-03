module.exports = (statusCode, message, token, res, admin) => {
    const options = {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
    };

      if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    res.cookie('jwt', token, options);
    admin.password = undefined;
    res.status(statusCode).json({
        status: 'succes',
        message,
        data: {
            admin
        }
    });
}