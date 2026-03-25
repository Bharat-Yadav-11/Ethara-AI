const express = require('express');
const router = express.Router();
const { getAllLeaves, applyLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAllLeaves); // HR & Employee can see (filtered on frontend)
router.post('/', protect, applyLeave); // Employee applies
router.put('/:id', protect, adminOnly, updateLeaveStatus); // HR Approves

module.exports = router;