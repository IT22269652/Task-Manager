import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UpdateTasks from "./UpdateTasks";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
      console.log("Fetched tasks:", data);
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
    doc.text(
      "Task Report - " +
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      14,
      20
    );

    const tableColumn = [
      "Title",
      "Description",
      "Priority",
      "Due Date",
      "Checklist",
      "Status",
      "Completed",
    ];
    const tableRows = tasks.map((task) => [
      task.title || "N/A",
      task.description || "N/A",
      task.priority || "N/A",
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A",
      task.checklist?.length > 0 ? task.checklist.join(", ") : "N/A",
      task.status || "Pending",
      task.completedCount || 0,
    ]);

    doc.autoTable(tableColumn, tableRows, {
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    try {
      doc.save(`tasks_report_${new Date().toISOString().split("T")[0]}.pdf`);
      console.log(
        "PDF generation and download attempted at:",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(
        "Failed to generate PDF. Check console for details. Error: " +
          error.message
      );
    }
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
    fetchTasks();
    console.log("Task update completed, refreshing list");
  };

  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskCounts = (tasksList) => {
    return {
      all: tasksList.length,
      pending: tasksList.filter((task) => task.status === "Pending").length,
      inProgress: tasksList.filter((task) => task.status === "In Progress")
        .length,
      complete: tasksList.filter((task) => task.status === "Complete").length,
    };
  };

  const taskCounts = getTaskCounts(filteredTasks);

  const displayedTasks = (() => {
    switch (activeTab) {
      case "pending":
        return filteredTasks.filter((task) => task.status === "Pending");
      case "inProgress":
        return filteredTasks.filter((task) => task.status === "In Progress");
      case "complete":
        return filteredTasks.filter((task) => task.status === "Complete");
      default:
        return filteredTasks;
    }
  })();

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Task Manager</h2>
          </div>
          <nav className="space-y-2">
            <a
              href="/admin/dashboard"
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-300"
            >
              <span className="mr-3 text-lg">🏠</span> Dashboard
            </a>
            <a
              href="/admin/tasks"
              className="flex items-center p-3 text-blue-700 bg-blue-50 rounded-lg"
            >
              <span className="mr-3 text-lg">📋</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-300"
            >
              <span className="mr-3 text-lg">➕</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-300"
            >
              <span className="mr-3 text-lg">👥</span> Manage Users
            </a>
            <a
              href="/logout"
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-300"
            >
              <span className="mr-3 text-lg">🚪</span> Logout
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Task Dashboard</h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 placeholder-gray-400"
              />
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg"
              >
                Generate PDF
              </button>
            </div>
          </div>
          <div className="flex space-x-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-4 text-sm font-semibold ${
                activeTab === "all"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              } transition duration-300`}
            >
              All ({taskCounts.all})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-2 px-4 text-sm font-semibold ${
                activeTab === "pending"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              } transition duration-300`}
            >
              Pending ({taskCounts.pending})
            </button>
            <button
              onClick={() => setActiveTab("inProgress")}
              className={`pb-2 px-4 text-sm font-semibold ${
                activeTab === "inProgress"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              } transition duration-300`}
            >
              In Progress ({taskCounts.inProgress})
            </button>
            <button
              onClick={() => setActiveTab("complete")}
              className={`pb-2 px-4 text-sm font-semibold ${
                activeTab === "complete"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-600 hover:text-gray-800"
              } transition duration-300`}
            >
              Complete ({taskCounts.complete})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => {
              const totalChecklist = task.checklist?.length || 1;
              const progress =
                ((task.completedCount || 0) / totalChecklist) * 100;

              return (
                <div
                  key={task._id}
                  className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex space-x-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "Pending"
                              ? "bg-purple-100 text-purple-700"
                              : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-500"
                              : "bg-yellow-50 text-yellow-600"
                          }`}
                        >
                          {task.status || "Pending"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority || "Low"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {task.title || "N/A"}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdate(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {task.description || "N/A"}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>
                      <strong>Due:</strong>{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                      <span>Checklist Progress</span>
                      <span>
                        {task.completedCount || 0}/{totalChecklist}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-full text-lg">
              No tasks found in this category.
            </p>
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
