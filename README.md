Task Manager (TM) - Full Stack Web Application

Overview

Task Manager (TM) is a full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) to help users manage their tasks efficiently. It provides features for user authentication (login and signup), user dashboards, user profiles, and an admin dashboard with task creation, management, and graphical insights.

Features

User Authentication: Secure login and signup functionalities.
User Dashboard: Display task statistics using interactive graphs.
User Profile: Manage personal details and view profile information.
Admin Dashboard: 
Create, manage, and delete tasks.
Manage user accounts.
Display task statistics using interactive graphs.

Responsive Design: Built with Tailwind CSS for an attractive and responsive interface.

Technologies Used

Frontend: React.js, Tailwind CSS
Backend: Node.js(v22.17.1), Express.js
Database: MongoDB(MONGO_URI=mongodb+srv://test:test123@taskmanager.1qg9uml.mongodb.net/?retryWrites=true&w=majority&appName=taskmanager, PORT=5000)
Other: React Router, Chart.js

Install Dependencies
Frontend : npm create vite@latest, npm install react-router-dom chart.js jspdf jspdf-autotable
Backend : npm init -y, npm install express mongoose bcryptjs cors dotenv nodemon jspdf jspdf-autotable

For the client (frontend):cd frontend
npm install
Run - npm run dev(Access at http://localhost:5173.)

For the server (backend):cd backend
npm install
Run - node server.js(npm run dev - (default is 5000))

Usage

Register a new account or log in with existing credentials.
Users can access their dashboard(view task graphs and recent tasks) and profile.
Admins can log in to manage tasks, users, and view task graphs on the admin dashboard.
