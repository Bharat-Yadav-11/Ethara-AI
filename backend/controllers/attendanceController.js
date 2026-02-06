const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.markAttendance = async (req, res, next) => {
    try {
        const { employeeId, date, status } = req.body;

        // 1. Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }

        // 2. Create record (The unique index in model prevents duplicates)
        const record = await Attendance.create({ employeeId, date, status });
        
        res.status(201).json(record);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            return next(new Error('Attendance already marked for this date'));
        }
        next(error);
    }
};