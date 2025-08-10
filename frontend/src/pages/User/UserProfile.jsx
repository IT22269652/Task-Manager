import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          setError("User data not found. Please log in again.");
          navigate("/login");
          return;
        }
        const response = await fetch(
          `http://localhost:5000/api/auth/users/${storedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setFormData({
            fullName: data.fullName,
            email: data.email,
            contactNumber: data.contactNumber,
          });
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("Network error. Please try again later.");
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${storedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Update error:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      contactNumber: user.contactNumber,
    });
    setError("");
    setSuccessMessage("");
  };

  const handleLogout = () => {
    if (window.confirm("Want to logout?")) {
      localStorage.removeItem("user");
      window.location.href = "/"; // Navigate to signup interface
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gradient-to-br ">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Dashboard</h2>
          </div>
          <nav className="space-y-3">
            <a
              href="/user/dashboard"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">📝</span> Task Details
            </a>
            <a
              href="/user/profile"
              className="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="mr-3 text-xl">👤</span> Profile
            </a>
            <a
              href="#"
              onClick={handleLogout}
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-3 text-xl">🚪</span> Logout
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">User Profile</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {successMessage && (
            <div className="mb-4 text-green-600 text-center">
              {successMessage}
            </div>
          )}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Contact Number
                </label>
                <input
                  type="number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : user ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Full Name:</strong> {user.fullName}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Contact Number:</strong> {user.contactNumber}
              </p>
              <button
                onClick={handleEdit}
                className="mt-4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Update
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
