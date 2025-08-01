import React from "react";

const CreateTask = () => {
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Task</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Task Title
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create App UI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Describe task"
              ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign To
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add Members"
                  />
                  <button
                    type="button"
                    className="ml-2 px-3 py-2 bg-gray-200 text-black-700 rounded-lg hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TODO Checklist
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Task"
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-2 bg-gray-200 text-black-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Add Attachments
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add File Link"
                />
                <button
                  type="button"
                  className="ml-2 px-3 py-2 bg-gray-200 text-black-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="p-2 w-full  bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
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
