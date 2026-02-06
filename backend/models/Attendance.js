const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: String, // Store as "YYYY-MM-DD" to easily check uniqueness
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        default: 'Present'
    }
}, { timestamps: true });

// Prevent duplicate attendance for the same person on the same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);