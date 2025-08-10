// UpdateTasks.jsx
import React, { useState, useEffect } from "react";

const UpdateTasks = ({ task, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    checklist: [],
    status: "Pending",
    completedCount: 0,
  });
  const [error, setError] = useState("");
  const [checklistItem, setChecklistItem] = useState("");

  useEffect(() => {
    if (task) {
      // Initialize checklist with checked status based on completedCount
      const updatedChecklist = task.checklist.map((item) => ({
        text: item,
        checked:
          task.completedCount > 0 &&
          task.checklist.indexOf(item) < task.completedCount,
      }));
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Low",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        checklist: updatedChecklist,
        status: task.status || "Pending",
        completedCount: task.completedCount || 0,
      });
    }
  }, [task]);

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
        checklist: [
          ...formData.checklist,
          { text: checklistItem.trim(), checked: false },
        ],
      });
      setChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter((_, i) => i !== index),
    });
  };

  const handleCheckboxChange = (index) => {
    const newChecklist = [...formData.checklist];
    const currentCheckedCount = newChecklist.filter(
      (item) => item.checked
    ).length;
    newChecklist[index] = {
      ...newChecklist[index],
      checked: !newChecklist[index].checked,
    };

    let completedCount = currentCheckedCount;
    if (newChecklist[index].checked) {
      completedCount += 1;
    } else {
      completedCount -= 1;
    }

    let status = "Pending";
    if (completedCount > 0 && completedCount < newChecklist.length) {
      status = "In Progress";
    } else if (
      completedCount === newChecklist.length &&
      newChecklist.length > 0
    ) {
      status = "Complete";
    }

    setFormData({
      ...formData,
      checklist: newChecklist,
      completedCount,
      status,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dueDate) {
      setError("All fields except priority and checklist are required.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            ...formData,
            checklist: formData.checklist.map((item) => item.text), // Send only text array to backend
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        setError(data.message || "Failed to update task.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Update error:", error);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Task</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                type="button"
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
                  className="flex items-center justify-between p-1 bg-gray-100 rounded"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() => handleCheckboxChange(index)}
                      className="mr-2"
                    />
                    <span>{item.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTasks;
