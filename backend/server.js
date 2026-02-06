const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 

// Load env vars
dotenv.config();

// Connect to Database
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); 
app.use(cors()); 

// Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});