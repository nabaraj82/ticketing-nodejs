const crypto = require('crypto')


module.exports = (bytes = 16) => crypto.randomBytes(bytes).toString('hex')