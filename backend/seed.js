const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // 1. Clear existing data
    await Promise.all([
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      Leave.deleteMany({})
    ]);
    console.log('🧹 Old data cleared');

    // 2. Define Employees with PLAIN TEXT passwords
    // We let the Employee Model's pre-save hook handle the hashing
    const employees = [
      {
        employeeId: "ADM001",
        fullName: "Admin HR",
        email: "admin@hrms.com",
        department: "Management",
        role: "HR",
        designation: "HR Manager",
        status: "Active",
        joinedDate: new Date("2022-01-01"),
        password: "admin123" // <--- Plain text
      },
      {
        employeeId: "EMP001",
        fullName: "Arjun Mehta",
        email: "arjun@hrms.com",
        department: "Engineering",
        role: "EMPLOYEE",
        designation: "Senior Developer",
        status: "Active",
        joinedDate: new Date("2023-01-15"),
        password: "emp123" // <--- Plain text
      },
      {
        employeeId: "EMP002",
        fullName: "Priya Sharma",
        email: "priya@hrms.com",
        department: "Design",
        role: "EMPLOYEE",
        designation: "UI/UX Lead",
        status: "Active",
        joinedDate: new Date("2023-03-22"),
        password: "emp123"
      },
      {
        employeeId: "EMP003",
        fullName: "Rahul Gupta",
        email: "rahul@hrms.com",
        department: "Marketing",
        role: "EMPLOYEE",
        designation: "Marketing Manager",
        status: "Active",
        joinedDate: new Date("2022-11-10"),
        password: "emp123"
      },
      {
        employeeId: "EMP004",
        fullName: "Sneha Patel",
        email: "sneha@hrms.com",
        department: "HR",
        role: "EMPLOYEE",
        designation: "HR Specialist",
        status: "On Leave",
        joinedDate: new Date("2023-06-01"),
        password: "emp123"
      },
      {
        employeeId: "EMP005",
        fullName: "Vikram Singh",
        email: "vikram@hrms.com",
        department: "Finance",
        role: "EMPLOYEE",
        designation: "Financial Analyst",
        status: "Inactive",
        joinedDate: new Date("2021-09-12"),
        password: "emp123"
      }
    ];

    // 3. Insert using Loop + Save() to trigger Encryption Hook
    // We do NOT use insertMany here because it bypasses middleware
    for (const empData of employees) {
        const employee = new Employee(empData);
        await employee.save();
    }

    console.log('✅ Database seeded successfully');
    console.log('🔑 Admin Login: admin@hrms.com / admin123');
    console.log('🔑 Emp Login: arjun@hrms.com / emp123');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();