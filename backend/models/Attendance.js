const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day'], default: 'Present' },
  checkIn: { type: String, default: '09:00 AM' },
  checkOut: { type: String, default: '06:00 PM' },
  workHours: { type: String, default: '9h 0m' }
}, { timestamps: true });

// Prevent duplicate entries for same user on same day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);