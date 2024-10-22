const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validateUserBody,
  validateUserLogin,
} = require('../middlewares/validation');
const { createUser, login } = require('../controllers/user');
const userRoutes = require('./users');
const postsRoutes = require('./posts');
const residentsRoutes = require('./residents');
const NotFoundError = require('../utils/errors/NotFoundError');
const { ERROR_MESSAGES } = require('../utils/errors/errors');

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserBody, createUser);
router.use('/users', auth, userRoutes);
router.use('/posts', auth, postsRoutes);
router.use('/residents', auth, residentsRoutes);
router.use(() => {
  throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
});

module.exports = router;
