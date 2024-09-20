const router = require("express").Router();
//auth
//validation
//controllers
const userRoutes = require('./users');
const postsRoutes = require('./posts');
const residentsRoutes = require('./residents');
// not found error

// signin
// signup
router.use('/users', auth, userRoutes);
router.use('/posts', auth, postsRoutes);
router.use('/residents', auth, residentsRoutes);
// error

module.exports = router;