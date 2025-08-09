import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTask from "./pages/Admin/CreateTask";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import UpdateTasks from "./pages/Admin/UpdateTasks";
import UserProfile from "./pages/User/UserProfile";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/tasks" element={<ManageTasks />} />
            <Route path="admin/create-task" element={<CreateTask />} />
            <Route path="admin/users" element={<ManageUsers />} />
            <Route path="admin/update-task/:id" element={<UpdateTasks />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="user/dashboard" element={<UserDashboard />} />
            <Route path="user/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
