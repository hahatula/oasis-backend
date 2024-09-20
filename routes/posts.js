const router = require("express").Router();

router.get("/", getPosts);
// router.get("/", getFollowedPosts); // TODO: this rout for future implementation
router.post("/", validatePostBody, createPost);
router.delete("/:postId", validateId, deletePost);
router.patch("/:postId", validateResidentUpdate, updateResident);
router.put("/:postId/likes", validateId, likePost);
router.delete("/:postId/likes", validateId, dislikePost);

module.exports = router;