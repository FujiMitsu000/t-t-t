const { verifyToken } = require('../utils/verifyToken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        if (!req.headers.authorization) {
            return res.status(403).json({message: "Пользователь не авторизован", access: false});
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = verifyToken(token);
        req.body.user = decodedToken;
        next()
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован", access: false});
    }
};