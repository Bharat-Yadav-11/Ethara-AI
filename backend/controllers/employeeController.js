const Employee = require('../models/Employee');

exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        next(error); // Pass to error handler
    }
};

exports.addEmployee = async (req, res, next) => {
    try {
        // Mongoose will handle unique validations automatically
        const employee = await Employee.create(req.body); 
        res.status(201).json(employee);
    } catch (error) {
        // Check for duplicate key error (E11000)
        if (error.code === 11000) {
            res.status(400);
            const field = Object.keys(error.keyValue)[0];
            return next(new Error(`Duplicate value entered for ${field}`));
        }
        next(error);
    }
};