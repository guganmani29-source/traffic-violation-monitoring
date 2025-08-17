const express = require('express');
const { listViolations, createViolation, getViolation, updateViolation, deleteViolation } = require('../controllers/violationController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', listViolations);
router.post('/', createViolation);
router.get('/:id', getViolation);
router.put('/:id', updateViolation);
router.delete('/:id', deleteViolation);

module.exports = router;
