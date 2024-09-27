const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/user');
const { validateUserUpdate } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
