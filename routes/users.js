const router = require('express').Router();
const { getCurrentUser, updateProfile, updateAvatar } = require('../controllers/user');
const {
  validateUserUpdate,
  validateUserAvatarUpdate,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me/profile', validateUserUpdate, updateProfile);
router.patch('/me/avatar', validateUserAvatarUpdate, updateAvatar);

module.exports = router;
