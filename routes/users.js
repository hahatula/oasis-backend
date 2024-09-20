const router = require("express").Router();

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateProfile);

module.exports = router;