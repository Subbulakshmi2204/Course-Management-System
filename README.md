# 🎓 Student Course Management and Learning Progress Tracking System

A full-stack web application designed to simplify course management, student enrollment, and learning progress tracking. The system enables students to register, enroll in courses, access learning materials, monitor their progress, and receive notifications, while administrators can efficiently manage courses, students, and reports through a centralized dashboard.

---

## 📌 Project Overview

The **Student Course Management and Learning Progress Tracking System** is developed to provide a centralized platform for managing academic courses and monitoring student learning progress.

Students can:
- Register and log in securely
- Browse available courses
- Enroll in courses
- Access course materials
- Track learning progress
- View course completion percentage
- Receive notifications

Administrators can:
- Manage students
- Add, update, and delete courses
- Monitor enrollments
- Generate reports
- Update course content
- View analytics dashboard

---

# 🚀 Features

## 👨‍🎓 Student Features

- User Registration
- Secure Login
- Profile Management
- Browse Courses
- Search Courses
- Enroll in Courses
- View Enrolled Courses
- Access Learning Materials
- Mark Modules as Completed
- Track Course Progress
- Progress Bar
- Completion Percentage
- Notifications

---

## 👨‍💼 Admin Features

- Secure Admin Login
- Add New Courses
- Edit Course Details
- Delete Courses
- Manage Students
- Monitor Course Enrollments
- View Dashboard Analytics
- Generate Progress Reports
- Update Course Content

---

# 📂 Project Modules

## Module 1 – User Authentication

### Features

- Student Registration
- Student Login
- Password Encryption
- Forgot Password
- JWT Authentication

---

## Module 2 – Course Management

### Features

- Add Course
- Update Course
- Delete Course
- View Course Details

---

## Module 3 – Course Enrollment

### Features

- Browse Courses
- Search Courses
- Enroll in Course
- View Enrolled Courses

### Enrollment Workflow

```
Student Login
      ↓
Browse Courses
      ↓
Select Course
      ↓
Enroll
      ↓
Confirmation
```

---

## Module 4 – Learning Management

### Features

- View Course Modules
- Access Learning Materials
- Mark Modules as Completed
- Continue Learning

### Example Course

**Full Stack Development**

Modules:
- HTML
- CSS
- JavaScript
- React
- Node.js
- MongoDB

---

## Module 5 – Progress Tracking

### Features

- Completion Percentage
- Progress Bar
- Completed Modules
- Pending Modules

### Sample Progress

| Course | Progress |
|---------|----------|
| Python | 80% |
| React | 60% |
| DBMS | 100% |

---

## Module 6 – Dashboard

### Student Dashboard

Displays:

- Total Courses Enrolled
- Courses Completed
- Ongoing Courses
- Progress Statistics

### Admin Dashboard

Displays:

- Total Students
- Total Courses
- Active Enrollments
- Completion Reports

---

## Module 7 – Notifications

### Features

- New Course Alerts
- Enrollment Confirmation
- Assignment Reminders
- Completion Certificates

Implemented using:

- Socket.IO
- WebSockets

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | HTML5, CSS3, Bootstrap, JavaScript, React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, bcrypt |
| Real-time Communication | Socket.IO |
| API Testing | Postman |
| Version Control | Git & GitHub |
| Deployment | Render / Railway / Vercel |

---

# 🗄️ Database Design

## Students Collection

| Field |
|--------|
| student_id |
| name |
| email |
| password |
| department |

---

## Courses Collection

| Field |
|--------|
| course_id |
| course_name |
| instructor |
| duration |
| description |
| category |

---

## Enrollment Collection

| Field |
|--------|
| enrollment_id |
| student_id |
| course_id |
| enrollment_date |

---

## Progress Collection

| Field |
|--------|
| progress_id |
| student_id |
| course_id |
| completed_modules |
| progress_percentage |

---

# 📁 Project Structure

```
Student-Course-Management-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── server.js
│   └── package.json
│
├── screenshots/
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/student-course-management-system.git
```

---

## Navigate to Project

```bash
cd student-course-management-system
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## Start Backend

```bash
npm start
```

---

## Start Frontend

```bash
npm start
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/forgot-password |

---

## Courses

| Method | Endpoint |
|---------|----------|
| GET | /api/courses |
| POST | /api/courses |
| PUT | /api/courses/:id |
| DELETE | /api/courses/:id |

---

## Enrollment

| Method | Endpoint |
|---------|----------|
| POST | /api/enroll |
| GET | /api/enrollments |

---

## Progress

| Method | Endpoint |
|---------|----------|
| GET | /api/progress |
| PUT | /api/progress/:id |

---

# 🔐 Security Features

- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Input Validation
- Secure API Access
- Role-Based Authorization (Admin & Student)

---

# 📊 Future Enhancements

- Email Verification
- Online Assignments
- Quiz Management
- Certificate Generation
- Attendance Tracking
- Discussion Forum
- Video Lectures
- AI-based Course Recommendation
- Dark Mode
- Mobile Responsive PWA

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Student Dashboard
- Admin Dashboard
- Course List
- Enrollment Page
- Progress Tracking
- Login Page

---

# 👨‍💻 Author

**Subbu Lakshmi**

**B.Sc. Computer Science with Artificial Intelligence**

Frontend Developer | Python Enthusiast | Full Stack Web Developer

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

# 📄 License

This project is developed for educational and academic purposes as part of a **Full Stack Web Development** course.

---

## ⭐ If you found this project helpful, don't forget to give it a star on GitHub!
```
