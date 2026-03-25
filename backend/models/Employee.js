const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  department: { type: String, required: true },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false 
  },
  role: { type: String, enum: ['HR', 'EMPLOYEE'], default: 'EMPLOYEE' },
  designation: { type: String, default: 'Staff' },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  joinedDate: { type: Date, default: Date.now },
  phoneNumber: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  reportingManager: { type: String, default: 'Admin' }
}, { timestamps: true });

// ---------------------------------------------------------
// 🔥 THE FIX: Remove 'next' parameter from async function
// ---------------------------------------------------------
EmployeeSchema.pre('save', async function () {
  // If password is not modified, simply return (stops execution)
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No need to call next() in async Mongoose v7+ middleware
});

// Compare Password
EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);