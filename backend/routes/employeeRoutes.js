const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new employee
router.post('/', async (req, res) => {
  const { employeeId, fullName, email, department } = req.body;

  try {
    const newEmployee = new Employee({ employeeId, fullName, email, department });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    // Handle Duplicate ID or Email error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Employee ID or Email already exists' });
    }
    res.status(400).json({ message: err.message });
  }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;