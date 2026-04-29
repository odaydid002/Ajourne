# Ajourne
GPA / Academic Calculator App

**Ajourne** is a full-stack application designed to manage academic records such as absences, delays, or student-related data. It consists of a **React Native mobile app**, a **Node.js backend**, and a **PostgreSQL database**, providing a complete and scalable solution.

---

## 📌 Overview

Ajourne helps streamline the management of student information by offering a structured system with a mobile interface and a powerful backend API.

The project is built with a clear separation between:

* 📱 Frontend (mobile app)
* 🌐 Backend (API server)
* 🗄️ Database (PostgreSQL)

---

## 🏗️ Architecture

```text
Mobile App (React Native)
        ↓
   REST API (Node.js)
        ↓
 PostgreSQL Database
```

---

## 🛠️ Tech Stack

### 📱 Frontend (Mobile)

* React Native
* JavaScript / TypeScript
* (Optional: Expo if you used it)

### 🌐 Backend

* Node.js
* Express.js
* RESTful API

### 🗄️ Database

* PostgreSQL

---

## 📂 Project Structure

```text
Ajourne/
│
├── frontend/        # React Native mobile application
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   └── ...
│
├── backend/         # Node.js backend (API)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── ...
│
└── README.md
```

---

## ✨ Features

* 📋 Manage student records (add, update, delete)
* ⏱️ Track absences and delays
* 📡 Communication between mobile app and backend API
* 🗄️ Persistent data storage with PostgreSQL
* ⚡ Modular and scalable architecture

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/odaydid002/Ajourne.git
cd Ajourne
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
```

Run the backend server:

```bash
npm run dev
```

---

### 3️⃣ Database Setup (PostgreSQL)

Make sure PostgreSQL is installed and running.

Create a database and update your `.env` file with the correct connection string.

You can run migrations or manually create tables depending on your implementation.

---

### 4️⃣ Frontend Setup (React Native)

```bash
cd frontend
npm install
```

Run the mobile app:

```bash
npm start
```

*(or `npx expo start` if using Expo)*

---

## 🔗 API Communication

The frontend communicates with the backend using HTTP requests.

Example:

```js
fetch("http://localhost:5000/api/endpoint")
```

Make sure to update the API base URL when testing on a real device.

---

## 🚧 Future Improvements

* 🔐 Authentication & authorization system
* 📊 Dashboard with analytics
* 🔔 Notifications system
* 🌍 Deployment (cloud hosting)
* 📱 Improved UI/UX

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Oudai Oulhadj**

---

## 💡 Notes

This project demonstrates:

* Full-stack development skills
* Mobile app development with React Native
* Backend API design
* Database integration with PostgreSQL

---

⭐ If you find this project useful, consider giving it a star!

## 📡 API Endpoints Documentation

The backend exposes a REST API used by the React Native frontend to manage students, absences, and delays.

---

## 🔐 Base URL

```
http://localhost:5000/api
```

---

## 👤 Students

### ➕ Create a student

```
POST /students
```

**Body:**

```json
{
  "name": "John Doe",
  "class": "L2 Informatique",
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "Student created successfully",
  "student": { ... }
}
```

---

### 📥 Get all students

```
GET /students
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "class": "L2 Informatique"
  }
]
```

---

### 🔍 Get student by ID

```
GET /students/:id
```

---

### ✏️ Update student

```
PUT /students/:id
```

**Body:**

```json
{
  "name": "Updated Name",
  "class": "Updated Class"
}
```

---

### ❌ Delete student

```
DELETE /students/:id
```

---

## ⏱️ Absences

### ➕ Add absence record

```
POST /absences
```

**Body:**

```json
{
  "student_id": 1,
  "date": "2026-04-29",
  "reason": "Sick"
}
```

---

### 📥 Get all absences

```
GET /absences
```

---

### 📥 Get absences by student

```
GET /absences/student/:id
```

---

## ⏳ Delays

### ➕ Add delay record

```
POST /delays
```

**Body:**

```json
{
  "student_id": 1,
  "date": "2026-04-29",
  "minutes_late": 15
}
```

---

### 📥 Get all delays

```
GET /delays
```

---

## ⚠️ Error Format

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

---

## 🔒 Notes

* All endpoints communicate with a PostgreSQL database.
* Input validation should be handled in the backend.
* Future versions may include authentication (JWT).

---

