const { Router } = require('express');
const { 
getGames, 
createGame, 
getGame, 
deleteGame, 
updateGame 
} = require('../controller/games.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { catcher } = require('../utils/catcher');

const router = Router();

router.get('/', authMiddleware, catcher(getGames));
router.get('/:gameId', authMiddleware, catcher(getGame));
router.post('/', authMiddleware, catcher(createGame));
router.delete('/:gameId', roleMiddleware('Admin'), catcher(deleteGame));
router.put('/:gameId', authMiddleware, catcher(updateGame));


module.exports = router;