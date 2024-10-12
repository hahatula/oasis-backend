const router = require('express').Router();
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
//   likePost,
//   dislikePost,
} = require('../controllers/posts');
const {
  validatePostBody,
  validateId,
  validatePostUpdate,
} = require('../middlewares/validation');

router.get('/', getPosts);
// router.get("/", getFollowedPosts); // TODO: this route for future implementation
router.post('/', validatePostBody, createPost);
router.patch('/:itemId', validateId, validatePostUpdate, updatePost);
router.delete('/:itemId', validateId, deletePost);
// router.put('/:itemId/likes', validateId, likePost);
// router.delete('/:itemId/likes', validateId, dislikePost);

module.exports = router;
