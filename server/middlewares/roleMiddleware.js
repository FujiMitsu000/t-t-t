const jwt = require('jsonwebtoken');


module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const payload = jwt.verify(token, 'meow');

            let hasRole = false;
                if (payload.sub.userRole === role) {
                    hasRole = true;
                    return next();
                }
            if (!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"});
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
    }
};