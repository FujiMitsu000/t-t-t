const bcrypt = require('bcrypt');

function getHashPassword(password) {
    const hashPassword = bcrypt.hashSync(password, 8);
    
    return hashPassword;
}

module.exports = {
    getHashPassword
};