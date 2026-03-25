const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); // Import HTTP
const { Server } = require('socket.io'); // Import Socket.io

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Frontend URL)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Make "io" accessible in Controllers via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('⚡ User Connected:', socket.id);
  socket.on('disconnect', () => console.log('User Disconnected'));
});

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes')); // NEW

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));