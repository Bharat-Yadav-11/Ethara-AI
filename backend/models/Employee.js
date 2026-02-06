const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: { 
        type: String, 
        required: [true, 'Employee ID is required'], 
        unique: true,
        trim: true
    },
    fullName: { 
        type: String, 
        required: [true, 'Full Name is required'],
        minlength: [3, 'Name must be at least 3 chars']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            'Please add a valid email'
        ]
    },
    department: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);