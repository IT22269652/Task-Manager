import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(
            "Failed to fetch users. Please ensure you are logged in as an admin."
          );
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("user")) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const generatePDF = () => {
    if (users.length === 0) {
      alert("No users available to generate a PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text("User Report", 14, 20);

    const tableColumn = ["Full Name", "Email", "Contact Number"];
    const tableRows = users.map((user) => [
      user.fullName,
      user.email,
      user.contactNumber,
    ]);

    doc.autoTable(tableColumn, tableRows, {
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    try {
      doc.save("users_report.pdf");
      console.log("PDF generation and download attempted");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
          setSuccessMessage("Delete successful");
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete user.");
        }
      } catch (error) {
        alert("Network error. Please try again later.");
        console.error("Delete error:", error);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <nav className="space-y-3">
            <a
              href="/admin/dashboard"
              className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3 text-xlmr-2">■</span> Dashboard
            </a>
            <a
              href="/admin/tasks"
              className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3 text-xl">▣</span> Manage Tasks
            </a>
            <a
              href="/admin/create-task"
              className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3 text-xl">＋</span> Create Task
            </a>
            <a
              href="/admin/users"
              className="flex items-center p-3 text-blue-600 bg-blue-100 rounded-lg"
            >
              <span className="mr-3 text-xl">⧇</span> Manage Users
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by full name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Generate PDF
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 text-center rounded">
              {successMessage}
            </div>
          )}
          {users.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Full Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Contact Number</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.contactNumber}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(user._id)}
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
            <p className="text-gray-600">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
