const router = require('express').Router();
const {
  getResidents,
  createResident,
  updateResident,
} = require('../controllers/residents');
const {
  validateResidentBody,
  validateResidentUpdate,
  validateId,
} = require('../middlewares/validation');

router.get('/', getResidents);
router.post('/', validateResidentBody, createResident);
router.patch('/:residentId', validateResidentUpdate, updateResident);
// router.delete('/:residentId', validateId, deletePost);

module.exports = router;
