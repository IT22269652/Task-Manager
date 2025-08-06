// CreateTask.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "", // Use dueDate to match backend
    checklist: [],
  });
  const [error, setError] = useState("");
  const [checklistItem, setChecklistItem] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleChecklistChange = (e) => {
    setChecklistItem(e.target.value);
  };

  const addChecklistItem = (e) => {
    e.preventDefault();
    if (checklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [...formData.checklist, checklistItem.trim()],
      });
      setChecklistItem("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dueDate) {
      setError("All fields except priority and checklist are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(formData), // Send JSON instead of FormData
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Task created successfully!");
        navigate("/admin/tasks");
      } else {
        setError(result.message || "Failed to create task.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Create task error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Task Manager
            </h2>
          </div>
          <nav className="space-y-2">
            <a
              href="/admin/dashboard"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">🏠</span> Dashboard
            </a>
            <a
              href="/admin/tasks"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">📋</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-2 text-blue-600 bg-blue-100 rounded-lg"
            >
              <span className="mr-2">➕</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">👥</span> Manage Users
            </a>
            <a
              href="/logout"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">🚪</span> Logout
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Task</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create App UI"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Describe task"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TODO Checklist
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={checklistItem}
                  onChange={handleChecklistChange}
                  className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a task"
                />
                <button
                  onClick={addChecklistItem}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2 space-y-1">
                {formData.checklist.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center p-1 bg-gray-100 rounded"
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="p-2 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
