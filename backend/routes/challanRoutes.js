const express = require('express');
const { listChallans, createChallan, getChallan, markPaid, deleteChallan } = require('../controllers/challanController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', listChallans);
router.post('/', createChallan);
router.get('/:id', getChallan);
router.patch('/:id/paid', markPaid);
router.delete('/:id', deleteChallan);

module.exports = router;
