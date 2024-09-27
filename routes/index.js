const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");
const { createUser, login } = require("../controllers/user");
const userRoutes = require('./users');
// const postsRoutes = require('./posts');
// const residentsRoutes = require('./residents');
const NotFoundError = require("../utils/errors/NotFoundError");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use('/users', auth, userRoutes);
// router.use('/posts', auth, postsRoutes);
// router.use('/residents', auth, residentsRoutes);
router.use(() => {
    throw new NotFoundError("Requested resource not found");
  });

module.exports = router;