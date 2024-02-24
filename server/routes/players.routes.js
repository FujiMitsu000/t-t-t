const { Router } = require('express');
const { 
getUsers, 
getUser, 
createUser, 
blockUser, 
updateUserStatus,
updateUserPassword,
} = require('../controller/players.controller');
const { catcher } = require('../utils/catcher');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.get('/', authMiddleware, catcher(getUsers));
router.get('/:userId', authMiddleware, catcher(getUser));
router.post('/', roleMiddleware('Admin'), catcher(createUser));
router.put('/password', authMiddleware, catcher(updateUserPassword));
router.put('/status', roleMiddleware('Admin'), catcher(updateUserStatus));
router.delete('/delete', roleMiddleware('Admin'), catcher(blockUser));

module.exports = router;