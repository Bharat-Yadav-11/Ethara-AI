const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }); // Password already excluded by schema
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

exports.addEmployee = async (req, res) => {
  const { employeeId, fullName, email, department, designation, status, joinedDate, phoneNumber, location, reportingManager } = req.body;

  try {
    const newEmployee = new Employee({
      employeeId, fullName, email, department, designation, status,
      joinedDate: joinedDate || Date.now(),
      phoneNumber, location, reportingManager,
      password: "123456", // Default temporary password
      role: "EMPLOYEE"
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Employee ID or Email already exists' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    // Cascade delete related data
    await Attendance.deleteMany({ employeeId: req.params.id });
    await Leave.deleteMany({ employeeId: req.params.id });
    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employee and related data deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};