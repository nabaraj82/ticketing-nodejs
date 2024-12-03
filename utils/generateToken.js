const jwt = require('jsonwebtoken');

module.exports = (id, role, tokenVersion) => {
    return jwt.sign({ id, role, tokenVersion }, process.env.SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRES,
    })
};