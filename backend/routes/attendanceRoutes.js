const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// GET attendance 
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('employeeId', 'fullName employeeId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST mark attendance
router.post('/', async (req, res) => {
  const { employeeId, date, status } = req.body; // employeeId here is the Database _id

  try {
    // 1. Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 2. Create Attendance
    const newRecord = new Attendance({ employeeId, date, status });
    await newRecord.save();
    
    res.status(201).json(newRecord);
  } catch (err) {
    // Handle Duplicate Date error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;