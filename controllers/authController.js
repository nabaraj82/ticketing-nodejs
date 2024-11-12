

exports.protect = (req, res, next) => {
    console.log(req.headers['secret-key'])
}