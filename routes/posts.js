const router = require('express').Router();
const {
  getPosts,
  createPost,
  deletePost,
  likePost,
  dislikePost,
} = require('../controllers/posts');
const { updateResident } = require('../controllers/residents');
const {
  validatePostBody,
  validateId,
  validateResidentUpdate,
} = require('../middlewares/validation');

router.get('/', getPosts);
// router.get("/", getFollowedPosts); // TODO: this rout for future implementation
router.post('/', validatePostBody, createPost);
router.delete('/:postId', validateId, deletePost);
router.patch('/:postId', validateResidentUpdate, updateResident);
router.put('/:postId/likes', validateId, likePost);
router.delete('/:postId/likes', validateId, dislikePost);

module.exports = router;
