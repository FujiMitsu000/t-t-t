const jwt = require('jsonwebtoken');

function createToken (id, username, userRole) {
    return jwt.sign(
        {sub: {id, username, userRole}},
        'meow'
        // {expiresIn: '24h'}
    )
}

module.exports = { createToken };
