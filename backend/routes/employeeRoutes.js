const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getEmployees);
router.post('/', protect, adminOnly, addEmployee);
router.delete('/:id', protect, adminOnly, deleteEmployee);

module.exports = router;