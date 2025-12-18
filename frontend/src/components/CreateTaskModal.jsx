import React, { useState } from "react";

export default function CreateTaskModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("Title is required");
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeZoom">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
          >
            ✖
          </button>
          <h2 className="text-3xl font-bold text-white pr-10">Create New Task</h2>
          <p className="text-gray-300 text-sm mt-2">Fill in the details to create your task</p>
        </div>

        {/* Form Body */}
        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                <i className="fa-solid fa-heading mr-2"></i>
                Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                <i className="fa-solid fa-align-left mr-2"></i>
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your task in detail..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-gray-900 transition-colors resize-none placeholder:text-gray-400"
              ></textarea>
            </div>

            {/* Time Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Start Time */}
              <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  <i className="fa-solid fa-clock mr-2"></i>
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-gray-900 transition-colors bg-white"
                />
              </div>

              {/* End Time */}
              <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  <i className="fa-solid fa-flag-checkered mr-2"></i>
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-gray-900 transition-colors bg-white"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border-2 border-gray-800">
              <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wide">
                <i className="fa-solid fa-calendar-check mr-2"></i>
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-700 rounded-lg text-white font-semibold focus:outline-none focus:border-gray-500 transition-colors bg-gray-800"
              />
            </div>

          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-200 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Create Task
          </button>
        </div>

      </div>
    </div>
  );
}