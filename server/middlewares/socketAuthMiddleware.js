const { verifyToken } = require('../utils/verifyToken');

module.exports = function (token) {
    try {
        if (!token) {
            return false
        }
        if (verifyToken(token)) {
            return true;
        }
    } catch (e) {
        // console.log('socket not connected');
        return false;
    }
};