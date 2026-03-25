const Leave = require('../models/Leave');

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employeeId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

exports.applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end - start);
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = new Leave({
      employeeId: req.user._id,
      leaveType, startDate, endDate, days, reason
    });
    await newLeave.save();

    // Real-Time Notification
    const populatedLeave = await newLeave.populate('employeeId', 'fullName');
    if (req.io) req.io.emit('new_leave_request', populatedLeave);

    res.status(201).json(newLeave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // Real-Time Notification
    if (req.io) req.io.emit('leave_status_updated', leave);

    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status' });
  }
};