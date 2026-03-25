const Attendance = require('../models/Attendance');

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('employeeId', 'fullName')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
};

exports.markAttendance = async (req, res) => {
  const { employeeId, date, status } = req.body;
  try {
    const newRecord = new Attendance({ employeeId, date, status });
    await newRecord.save();

    // Real-Time Notification
    const populatedRecord = await newRecord.populate('employeeId', 'fullName');
    if (req.io) req.io.emit('new_attendance', populatedRecord);

    res.status(201).json(newRecord);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    res.status(400).json({ message: err.message });
  }
};