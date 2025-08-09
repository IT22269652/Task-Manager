import React, { useState, useEffect, useRef } from "react";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-50 font-sans">
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
              <span className="mr-3 text-xl">🏠</span> Dashboard
            </a>
            <a
              href="/admin/tasks"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">📋</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">➕</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">👥</span> Manage Users
            </a>
            <a
              href="/logout"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">🚪</span> Logout
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
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <canvas ref={pieChartRef} id="taskDistributionChart"></canvas>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <canvas ref={barChartRef} id="taskPriorityChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
