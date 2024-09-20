const router = require("express").Router();

router.get("/", getResidents);
router.post("/", validateResidentBody, createResident);
router.patch("/:residentId", validateResidentUpdate, updateResident);
router.delete("/:residentId", validateId, deletePost);

module.exports = router;