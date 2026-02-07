const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee'); 
const Attendance = require('./models/Attendance');

dotenv.config();

const employees = [
  { employeeId: "EMP001", fullName: "James Wilson", email: "james.wilson@company.com", department: "Engineering" },
  { employeeId: "EMP002", fullName: "Linda Martinez", email: "linda.martinez@company.com", department: "HR" },
  { employeeId: "EMP003", fullName: "Robert Brown", email: "robert.brown@company.com", department: "Sales" },
  { employeeId: "EMP004", fullName: "Michael Davis", email: "michael.davis@company.com", department: "Engineering" },
  { employeeId: "EMP005", fullName: "Jennifer Garcia", email: "jennifer.garcia@company.com", department: "Marketing" },
  { employeeId: "EMP006", fullName: "William Rodriguez", email: "william.rodriguez@company.com", department: "Finance" },
  { employeeId: "EMP007", fullName: "David Miller", email: "david.miller@company.com", department: "Engineering" },
  { employeeId: "EMP008", fullName: "Elizabeth Taylor", email: "elizabeth.taylor@company.com", department: "Engineering" },
  { employeeId: "EMP009", fullName: "Barbara Anderson", email: "barbara.anderson@company.com", department: "HR" },
  { employeeId: "EMP010", fullName: "Richard Thomas", email: "richard.thomas@company.com", department: "Sales" },
  { employeeId: "EMP011", fullName: "Joseph Moore", email: "joseph.moore@company.com", department: "Engineering" },
  { employeeId: "EMP012", fullName: "Susan Jackson", email: "susan.jackson@company.com", department: "Marketing" },
  { employeeId: "EMP013", fullName: "Thomas White", email: "thomas.white@company.com", department: "Finance" },
  { employeeId: "EMP014", fullName: "Jessica Harris", email: "jessica.harris@company.com", department: "Engineering" },
  { employeeId: "EMP015", fullName: "Charles Martin", email: "charles.martin@company.com", department: "Engineering" },
  { employeeId: "EMP016", fullName: "Karen Thompson", email: "karen.thompson@company.com", department: "HR" },
  { employeeId: "EMP017", fullName: "Christopher Garcia", email: "christopher.garcia@company.com", department: "Sales" },
  { employeeId: "EMP018", fullName: "Sarah Martinez", email: "sarah.martinez@company.com", department: "Engineering" },
  { employeeId: "EMP019", fullName: "Daniel Robinson", email: "daniel.robinson@company.com", department: "Marketing" },
  { employeeId: "EMP020", fullName: "Lisa Clark", email: "lisa.clark@company.com", department: "Finance" },
  { employeeId: "EMP021", fullName: "Matthew Rodriguez", email: "matthew.rodriguez@company.com", department: "Engineering" },
  { employeeId: "EMP022", fullName: "Betty Lewis", email: "betty.lewis@company.com", department: "Engineering" },
  { employeeId: "EMP023", fullName: "Anthony Lee", email: "anthony.lee@company.com", department: "HR" },
  { employeeId: "EMP024", fullName: "Sandra Walker", email: "sandra.walker@company.com", department: "Sales" },
  { employeeId: "EMP025", fullName: "Mark Hall", email: "mark.hall@company.com", department: "Engineering" },
  { employeeId: "EMP026", fullName: "Ashley Allen", email: "ashley.allen@company.com", department: "Marketing" },
  { employeeId: "EMP027", fullName: "Donald Young", email: "donald.young@company.com", department: "Finance" },
  { employeeId: "EMP028", fullName: "Steven Hernandez", email: "steven.hernandez@company.com", department: "Engineering" },
  { employeeId: "EMP029", fullName: "Paul King", email: "paul.king@company.com", department: "Engineering" },
  { employeeId: "EMP030", fullName: "Kimberly Wright", email: "kimberly.wright@company.com", department: "HR" },
  { employeeId: "EMP031", fullName: "Andrew Lopez", email: "andrew.lopez@company.com", department: "Sales" },
  { employeeId: "EMP032", fullName: "Emily Hill", email: "emily.hill@company.com", department: "Engineering" },
  { employeeId: "EMP033", fullName: "Joshua Scott", email: "joshua.scott@company.com", department: "Marketing" },
  { employeeId: "EMP034", fullName: "Michelle Green", email: "michelle.green@company.com", department: "Finance" },
  { employeeId: "EMP035", fullName: "Kevin Adams", email: "kevin.adams@company.com", department: "Engineering" },
  { employeeId: "EMP036", fullName: "Brian Baker", email: "brian.baker@company.com", department: "Engineering" },
  { employeeId: "EMP037", fullName: "George Gonzalez", email: "george.gonzalez@company.com", department: "HR" },
  { employeeId: "EMP038", fullName: "Edward Nelson", email: "edward.nelson@company.com", department: "Sales" },
  { employeeId: "EMP039", fullName: "Ronald Carter", email: "ronald.carter@company.com", department: "Engineering" },
  { employeeId: "EMP040", fullName: "Timothy Mitchell", email: "timothy.mitchell@company.com", department: "Marketing" },
  { employeeId: "EMP041", fullName: "Jason Perez", email: "jason.perez@company.com", department: "Finance" },
  { employeeId: "EMP042", fullName: "Jeffrey Roberts", email: "jeffrey.roberts@company.com", department: "Engineering" },
  { employeeId: "EMP043", fullName: "Ryan Turner", email: "ryan.turner@company.com", department: "Engineering" },
  { employeeId: "EMP044", fullName: "Jacob Phillips", email: "jacob.phillips@company.com", department: "HR" },
  { employeeId: "EMP045", fullName: "Gary Campbell", email: "gary.campbell@company.com", department: "Sales" },
  { employeeId: "EMP046", fullName: "Nicholas Parker", email: "nicholas.parker@company.com", department: "Engineering" },
  { employeeId: "EMP047", fullName: "Eric Evans", email: "eric.evans@company.com", department: "Marketing" },
  { employeeId: "EMP048", fullName: "Stephen Edwards", email: "stephen.edwards@company.com", department: "Finance" },
  { employeeId: "EMP049", fullName: "Larry Collins", email: "larry.collins@company.com", department: "Engineering" },
  { employeeId: "EMP050", fullName: "Justin Stewart", email: "justin.stewart@company.com", department: "Operations" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB...');

    // Clear existing data to avoid duplicates
    console.log('Clearing existing employee data...');
    await Employee.deleteMany({});
    await Attendance.deleteMany({});

    // Insert new data
    console.log('Seeding new employees...');
    await Employee.insertMany(employees);

    console.log('Success! 50 Employees added.');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();