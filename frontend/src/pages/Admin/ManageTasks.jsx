import React, { useState, useEffect } from "react";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          setError("Failed to fetch tasks. Please try again.");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("user")) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks/report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "task_report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert("Report downloaded successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to generate report.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
      console.error("Download error:", error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

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
              className="flex items-center p-2 text-blue-600 bg-blue-100 rounded-lg"
            >
              <span className="mr-2">📋</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">➕</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2">👥</span> Team Members
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Tasks</h1>
          <button
            onClick={handleDownloadReport}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Download Report
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {tasks.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Title</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">{task.priority}</td>
                    <td className="p-2">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
