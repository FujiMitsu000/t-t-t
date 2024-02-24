const jwt = require('jsonwebtoken');

function verifyToken (token) {
    return jwt.verify(token, 'meow');
}

module.exports = { verifyToken };
