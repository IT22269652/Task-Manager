import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

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

  const getTaskCounts = (tasksList) => {
    return {
      all: tasksList.length,
      pending: tasksList.filter((task) => task.status === "Pending").length,
      inProgress: tasksList.filter((task) => task.status === "In Progress")
        .length,
      complete: tasksList.filter((task) => task.status === "Complete").length,
    };
  };

  const getPriorityCounts = (tasksList) => {
    return {
      low: tasksList.filter((task) => task.priority === "Low").length,
      medium: tasksList.filter((task) => task.priority === "Medium").length,
      high: tasksList.filter((task) => task.priority === "High").length,
    };
  };

  const taskCounts = getTaskCounts(tasks);
  const priorityCounts = getPriorityCounts(tasks);

  useEffect(() => {
    if (
      loading ||
      !pieChartRef.current ||
      !barChartRef.current ||
      !window.Chart
    )
      return;

    let pieChartInstance = null;
    let barChartInstance = null;

    pieChartInstance = new window.Chart(pieChartRef.current, {
      type: "pie",
      data: {
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [
          {
            data: [
              taskCounts.pending,
              taskCounts.inProgress,
              taskCounts.complete,
            ],
            backgroundColor: ["#9B59B6", "#3498DB", "#2ECC71"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Task Distribution" },
        },
      },
    });

    barChartInstance = new window.Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            label: "Count",
            data: [
              priorityCounts.low,
              priorityCounts.medium,
              priorityCounts.high,
            ],
            backgroundColor: ["#27AE60", "#F39C12", "#E74C3C"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Task Priority Levels" },
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });

    return () => {
      if (pieChartInstance) pieChartInstance.destroy();
      if (barChartInstance) barChartInstance.destroy();
    };
  }, [loading, tasks]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Task Manager</h2>
          </div>
          <nav className="space-y-3">
            <a
              href="/admin/dashboard"
              className="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="mr-3 text-xl">■</span> Dashboard
            </a>
            <a
              href="/admin/tasks"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">▣</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">＋</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">⧇</span> Manage Users
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Dashboard Overview
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              {taskCounts.all} Total Tasks
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
              {taskCounts.pending} Pending
            </div>
            <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full">
              {taskCounts.inProgress} In Progress
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
              {taskCounts.complete} Completed
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <canvas ref={pieChartRef} id="taskDistributionChart"></canvas>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <canvas ref={barChartRef} id="taskPriorityChart"></canvas>
            </div>
          </div>
          {/* Task Data Display */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <button
              onClick={() => navigate("/admin/tasks")}
              className="bg-blue-100 text-gray px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300"
            >
              Show All
            </button>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {tasks.length > 0 ? (
              tasks.slice(0, 6).map((task) => (
                <div
                  key={task._id}
                  className="min-w-[250px] bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    {task.title || "N/A"}
                  </h3>
                  <div className="flex flex-col space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "Pending"
                            ? "bg-purple-100 text-purple-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-500"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.status || "Pending"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span>{" "}
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
                    </p>
                    <p>
                      <span className="font-medium">Due:</span>{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                No tasks available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
