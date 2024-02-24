const { Router } = require('express');
const { getStatistics, getPlayerStatistics } = require('../controller/statistics.controller');
const { catcher } = require('../utils/catcher');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', authMiddleware, catcher(getStatistics));
router.get('/:userId', authMiddleware, catcher(getPlayerStatistics));

module.exports = router;
