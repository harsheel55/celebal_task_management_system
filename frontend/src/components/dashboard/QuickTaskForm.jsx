// frontend/src/components/dashboard/QuickTaskForm.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuickTaskForm = ({ onClose, onTaskCreated, initialDate = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    dueDate: '',
    dueTime: '09:00'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialDate) {
      const date = new Date(initialDate);
      setFormData(prev => ({
        ...prev,
        dueDate: date.toISOString().split('T')[0],
        dueTime: '09:00'
      }));
    }
  }, [initialDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Check if user is logged in
      if (!token) {
        toast.error('Please log in to create tasks');
        return;
      }

      // Combine date and time if both are provided
      let dueDateTime = null;
      if (formData.dueDate && formData.dueTime) {
        dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      } else if (formData.dueDate) {
        dueDateTime = new Date(`${formData.dueDate}T09:00`).toISOString();
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        dueDate: dueDateTime,
        status: 'To Do'  // Fixed: Changed from 'Pending' to 'To Do'
      };

      console.log('Sending task data:', taskData);

      const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Task created successfully:', response.data);
      toast.success('Task created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: '',
        dueDate: '',
        dueTime: '09:00'
      });
      
      onTaskCreated();
      onClose(); // Close the form after successful creation

    } catch (error) {
      console.error('=== CREATE TASK ERROR ===');
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Request config:', error.config);
      
      // Show the actual error message from backend
      let errorMessage = 'Failed to create task';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please log in again';
        // Optionally clear token and redirect to login
        localStorage.removeItem('token');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(err => err.message || err).join(', ');
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Quick date shortcuts
  const setQuickDate = (option) => {
    const today = new Date();
    let targetDate = new Date(today);

    switch (option) {
      case 'today':
        break;
      case 'tomorrow':
        targetDate.setDate(today.getDate() + 1);
        break;
      case 'next_week':
        targetDate.setDate(today.getDate() + 7);
        break;
      case 'weekend':
        const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
        targetDate.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
        break;
      default:
        return;
    }

    setFormData(prev => ({
      ...prev,
      dueDate: targetDate.toISOString().split('T')[0]
    }));
  };

  // Quick time shortcuts
  const setQuickTime = (time) => {
    setFormData(prev => ({
      ...prev,
      dueTime: time
    }));
  };

  const quickDates = [
    { label: 'Today', value: 'today', shortcut: 'T' },
    { label: 'Tomorrow', value: 'tomorrow', shortcut: 'M' },
    { label: 'This Weekend', value: 'weekend', shortcut: 'W' },
    { label: 'Next Week', value: 'next_week', shortcut: 'N' }
  ];

  const quickTimes = [
    { label: 'Morning', value: '09:00' },
    { label: 'Afternoon', value: '14:00' },
    { label: 'Evening', value: '18:00' },
    { label: 'Night', value: '21:00' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">
            {initialDate ? 'Add Task for ' + new Date(initialDate).toLocaleDateString() : 'Quick Add Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Quick Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Due Date
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {quickDates.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQuickDate(option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    (formData.dueDate === new Date().toISOString().split('T')[0] && option.value === 'today') ||
                    (formData.dueDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] && option.value === 'tomorrow')
                      ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          {/* Quick Time Selection */}
          {formData.dueDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {quickTimes.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setQuickTime(option.value)}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                      formData.dueTime === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <input
                type="time"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>
          )}

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              >
                <option className="bg-white dark:bg-gray-800" value="Low">Low</option>
                <option className="bg-white dark:bg-gray-800" value="Medium">Medium</option>
                <option className="bg-white dark:bg-gray-800" value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Work, Personal..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>

        {/* Keyboard Shortcuts Hint */}
        <div className="px-4 sm:px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-3">
            💡 Tip: Use Tab to navigate quickly between fields
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickTaskForm;