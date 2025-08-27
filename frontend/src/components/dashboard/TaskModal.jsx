// frontend/src/components/dashboard/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon,
  TagIcon,
  FlagIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskModal = ({ task, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    category: '',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        category: task.category || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        assignedTo: task.assignedTo?._id || task.assignedTo || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Task updated successfully');
      setEditMode(false);
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Update task error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Task deleted successfully');
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, 
        { ...formData, status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setFormData(prev => ({ ...prev, status: newStatus }));
      toast.success('Status updated successfully');
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Status update error:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {editMode ? 'Edit Task' : 'Task Details'}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
              {formData.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!editMode && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add task description..."
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Work, Personal, Project"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Task Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Task Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Due Date */}
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Due Date</p>
                    <p className="text-gray-600">{formatDateTime(task.dueDate)}</p>
                  </div>
                </div>

                {/* Priority */}
                <div className="flex items-start space-x-3">
                  <FlagIcon className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Priority</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {/* Category */}
                {task.category && (
                  <div className="flex items-start space-x-3">
                    <TagIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Category</p>
                      <p className="text-gray-600">{task.category}</p>
                    </div>
                  </div>
                )}

                {/* Assigned To */}
                {task.assignedTo && (
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Assigned To</p>
                      <p className="text-gray-600">
                        {typeof task.assignedTo === 'object' ? task.assignedTo.name : task.assignedTo}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Status Actions */}
              <div className="border-t pt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'In Progress', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.status === status
                          ? `${getStatusColor(status)} ring-2 ring-offset-1`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Timestamps */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;