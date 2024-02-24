const {InappropriateActionError, NotFoundError } = require('../errors')

module.exports = {
    handler: (err, req, res, next) => {
        console.log(err.message);

        if (err instanceof InappropriateActionError) {
            res.status(400).json({error: err.message});
        } else if (err instanceof NotFoundError) {
            res.status(400).json({error: err.message});
        } else {
            res.status(500).json({error: 'Interal server error'});
        }
    }
};
