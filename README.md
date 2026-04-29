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
