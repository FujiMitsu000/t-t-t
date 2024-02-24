const { Router } = require('express')
const statistics = require('./statistics.routes');
const games = require('./games.routes');
const players = require('./players.routes');
const auth = require('./auth.routes');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


const router = Router();

router.use('/statistics', statistics);
router.use('/games', games);
router.use('/players', players);
router.use('/auth', auth);

module.exports = router;