const express = require('express');
const router = express.Router();
const { getAllAttendance, markAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAllAttendance);
router.post('/', protect, adminOnly, markAttendance);

module.exports = router;