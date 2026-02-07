# HRMS Lite

A lightweight Human Resource Management System designed to manage employee records and track daily attendance efficiently. This project was built as a full-stack assessment to demonstrate RESTful API design, database modeling, and frontend integration.

## Live Application
- **URL:** https://hrms.bharat-bhushan.me

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Styling)
- Axios (API Integration)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- CORS & Helmet (Security)

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

**1. Employee Management**
- View a complete list of employees with search functionality.
- Add new employees with validation for unique IDs and Emails.
- Delete employees (automatically removes associated attendance records).
- Visual profile avatars generated based on employee initials.

**2. Attendance Management**
- Mark daily attendance (Present/Absent).
- View attendance history for specific employees.
- Validation prevents marking attendance twice for the same employee on the same date.

**3. System & UI**
- Server-side validation for required fields and email formats.
- Responsive dashboard layout with a sidebar and sticky header.
- Error handling with meaningful user feedback (toast notifications).

## Project Setup (Local Development)

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js installed.
- A MongoDB Atlas connection string.

### 1. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the server:
```bash
node server.js
```
The server should run on `http://localhost:5000`.

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder to point to your local backend:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the React application:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Database Seeding (Test Data)
To save time testing the application, I have included a script to populate the database with 50 dummy employee records.

To run the seed script:
1. Ensure your backend `.env` file is set up.
2. Run the following command inside the `backend` folder:
```bash
node seed.js
```
3. Refresh the frontend to see the data.

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create a new employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET | `/api/attendance` | Get attendance records |
| POST | `/api/attendance` | Mark attendance for a specific date |

## Assumptions & Design Decisions
- **Authentication:** As per the requirements, no login system was implemented. The system assumes a single admin user.
- **Deletions:** I implemented a cascade delete logic. If an employee is deleted, their attendance history is also removed to maintain database integrity.
- **Validations:** Strict regex validation is applied to emails to ensure data quality.
