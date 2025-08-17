const express = require('express');
const { listAlerts, createAlert, markRead, deleteAlert } = require('../controllers/alertController');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', listAlerts);
router.post('/', createAlert);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteAlert);

module.exports = router;
