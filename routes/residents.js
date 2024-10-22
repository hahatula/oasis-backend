const router = require('express').Router();
const {
  getResidents,
  createResident,
  updateResident,
} = require('../controllers/residents');
const {
  validateResidentBody,
  validateResidentUpdate,
} = require('../middlewares/validation');

router.get('/', getResidents);
router.post('/', validateResidentBody, createResident);
router.patch('/:residentId', validateResidentUpdate, updateResident);

module.exports = router;
