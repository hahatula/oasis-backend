const router = require('express').Router();
const {
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getHostInfo,
} = require('../controllers/user');
const {
  validateUserUpdate,
  validateUserAvatarUpdate,
  validateId,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.get('/:hostId',validateId, getHostInfo);
router.patch('/me/profile', validateUserUpdate, updateProfile);
router.patch('/me/avatar', validateUserAvatarUpdate, updateAvatar);

module.exports = router;
