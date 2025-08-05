import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UpdateTasks from "./UpdateTasks"; // Ensure this path is correct

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

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
        setError("Failed to fetch tasks. Please check your backend or token.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (tasks.length === 0) {
      alert("No tasks available to generate a PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Task Report", 14, 20);

    const tableColumn = ["Title", "Description", "Priority", "Due Date"];
    const tableRows = tasks.map((task) => [
      task.title || "N/A",
      task.description || "N/A",
      task.priority || "N/A",
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
    ]);

    doc.autoTable(tableColumn, tableRows, {
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save("tasks_report.pdf");
    console.log("PDF generation attempted");
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/${taskId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        if (response.ok) {
          setTasks(tasks.filter((task) => task._id !== taskId));
          console.log("Task deleted successfully");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete task.");
        }
      } catch (error) {
        alert("Network error. Please try again later.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    console.log("Opening update for task:", task._id);
  };

  const handleUpdateComplete = () => {
    setSelectedTask(null);
    fetchTasks(); // Refresh tasks after update
    console.log("Task update completed, refreshing list");
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Tasks</h1>
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Generate PDF
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
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="p-2">{task.title || "N/A"}</td>
                    <td className="p-2">{task.description || "N/A"}</td>
                    <td className="p-2">{task.priority || "N/A"}</td>
                    <td className="p-2">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleUpdate(task)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
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
      {selectedTask && (
        <UpdateTasks
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateComplete}
        />
      )}
    </div>
  );
};

export default ManageTasks;
