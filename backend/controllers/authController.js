const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Explicitly select password because it's excluded in the Schema
    const user = await Employee.findOne({ email }).select('+password');

    // 2. Generic Error Message for security (Prevent User Enumeration)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Return Data (Without Password)
    res.json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during login' });
  }
};