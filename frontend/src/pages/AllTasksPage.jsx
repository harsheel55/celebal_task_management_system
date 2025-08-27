import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Galaxy from '../components/Aurora'; // Assuming this is your Galaxy component

const AllTasksPage = () => {
  console.log('AllTasksPage component is rendering');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    category: '',
    tags: [],
    estimatedTime: ''
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           sessionStorage.getItem('token') || 
           sessionStorage.getItem('authToken');
  };

  // API request helper
  const apiRequest = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    console.log('Making API request:', { url, method: options.method || 'GET', body: options.body });

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `HTTP ${response.status}` };
        }
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Success response text:', responseText);
      
      if (!responseText) {
        return {};
      }
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: options.method || 'GET',
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching tasks from API...');
      
      const data = await apiRequest('http://localhost:5000/api/tasks');
      
      console.log('Raw API response:', data);
      
      // Handle different response formats
      let tasksArray;
      if (Array.isArray(data)) {
        tasksArray = data;
      } else if (data && Array.isArray(data.tasks)) {
        tasksArray = data.tasks;
      } else if (data && Array.isArray(data.data)) {
        tasksArray = data.data;
      } else {
        console.warn('Unexpected API response format:', data);
        tasksArray = [];
      }
      
      console.log('Tasks array to set:', tasksArray);
      setTasks(tasksArray);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      setLoading(false);
      
      // Fallback to dummy data for development/testing
      setTasks([
        {
          _id: 'dummy-1',
          title: '⚠️ API Connection Failed - Dummy Data',
          description: 'This is sample data shown because the API call failed',
          status: 'To Do',
          priority: 'High',
          dueDate: '2025-01-15',
          category: 'System',
          tags: ['error', 'dummy'],
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      setOperationLoading(true);
      console.log('Creating task:', taskData);
      
      const data = await apiRequest('http://localhost:5000/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      
      console.log('Task created:', data);
      
      // Add the new task to the local state
      const newTask = data.task || data;
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      // Close modal and reset form
      setShowCreateModal(false);
      resetForm();
      setOperationLoading(false);
      
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
      setOperationLoading(false);
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      setOperationLoading(true);
      console.log('Updating task:', taskId, taskData);
      
      const data = await apiRequest(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
      
      console.log('Task updated:', data);
      
      // Update the task in local state
      const updatedTask = data.task || data;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      
      // Close modal and reset form
      setShowEditModal(false);
      resetForm();
      setSelectedTask(null);
      setOperationLoading(false);
      
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
      setOperationLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setOperationLoading(true);
      console.log('Deleting task:', taskId);
      
      await apiRequest(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      console.log('Task deleted:', taskId);
      
      // Remove the task from local state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setOperationLoading(false);
      
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
      setOperationLoading(false);
    }
  };

  // Quick status update
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      console.log('Updating task status:', { taskId, newStatus });
      
      // Validate task ID format
      if (!taskId || typeof taskId !== 'string' || taskId.length !== 24) {
        throw new Error(`Invalid task ID format: ${taskId}`);
      }
      
      // Validate status value
      const validStatuses = ['To Do', 'In Progress', 'Completed'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      const requestData = { status: newStatus };
      console.log('Sending request data:', requestData);
      
      const data = await apiRequest(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(requestData),
      });
      
      console.log('Status update response:', data);
      
      // Update the task in local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
    } catch (err) {
      console.error('=== STATUS UPDATE ERROR ===');
      console.error('Task ID:', taskId);
      console.error('New Status:', newStatus);
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Failed to update task status';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      alert(`Error updating task status: ${errorMessage}`);
    }
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
      category: '',
      tags: [],
      estimatedTime: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    if (selectedTask) {
      updateTask(selectedTask._id, formData);
    } else {
      createTask(formData);
    }
  };

  // Modal handlers
  const handleCreateClick = () => {
    resetForm();
    setSelectedTask(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'To Do',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      category: task.category || '',
      tags: task.tags || [],
      estimatedTime: task.estimatedTime || ''
    });
    setShowEditModal(true);
  };

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  // Function to get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Completed': 
        return { 
          color: 'bg-green-500/20 text-green-300 border-green-400/30', 
          icon: CheckCircleIcon 
        };
      case 'In Progress': 
        return { 
          color: 'bg-blue-500/20 text-blue-300 border-blue-400/30', 
          icon: ClockIcon 
        };
      case 'To Do': 
        return { 
          color: 'bg-purple-500/20 text-purple-300 border-purple-400/30', 
          icon: ExclamationTriangleIcon 
        };
      default: 
        return { 
          color: 'bg-gray-500/20 text-gray-300 border-gray-400/30', 
          icon: ClockIcon 
        };
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `Overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = Array.isArray(tasks) ? tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    }) : [];

  // Task Form Modal Component
  const TaskFormModal = ({ show, onClose, title, onSubmit }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                placeholder="Enter task title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 resize-none"
                placeholder="Enter task description..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                >
                  <option value="To Do" className="bg-gray-800">To Do</option>
                  <option value="In Progress" className="bg-gray-800">In Progress</option>
                  <option value="Completed" className="bg-gray-800">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                >
                  <option value="Low" className="bg-gray-800">Low</option>
                  <option value="Medium" className="bg-gray-800">Medium</option>
                  <option value="High" className="bg-gray-800">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                  placeholder="e.g., Work, Personal"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                  placeholder="urgent, meeting, review"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Time (minutes)</label>
                <input
                  type="number"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
                  placeholder="e.g., 30"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={operationLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed"
              >
                {operationLoading ? 'Saving...' : (selectedTask ? 'Update Task' : 'Create Task')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // View Task Modal Component
  const ViewTaskModal = ({ show, task, onClose }) => {
    if (!show || !task) return null;

    const statusInfo = getStatusInfo(task.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Task Details</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg border ${statusInfo.color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-300 leading-relaxed">{task.description}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="block text-sm font-medium text-gray-400 mb-1">Status</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.color}`}>
                    {task.status}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-400 mb-1">Priority</span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {task.category && (
                  <div>
                    <span className="block text-sm font-medium text-gray-400 mb-1">Category</span>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm font-medium rounded-full border border-indigo-400/30">
                      {task.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="block text-sm font-medium text-gray-400 mb-1">Due Date</span>
                  <p className={`text-white ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-400 font-semibold' : ''}`}>
                    {formatDate(task.dueDate)}
                  </p>
                </div>
                
                {task.estimatedTime && (
                  <div>
                    <span className="block text-sm font-medium text-gray-400 mb-1">Estimated Time</span>
                    <p className="text-white">{task.estimatedTime} minutes</p>
                  </div>
                )}
                
                {task.createdAt && (
                  <div>
                    <span className="block text-sm font-medium text-gray-400 mb-1">Created</span>
                    <p className="text-white">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div>
                <span className="block text-sm font-medium text-gray-400 mb-2">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-sm rounded-lg border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-white/20">
            <button
              onClick={() => {
                onClose();
                handleEditClick(task);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              Edit Task
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  console.log('Current state:', { tasks: Array.isArray(tasks) ? tasks.length : 'not array', loading, error });

  if (loading) {
    return (
      <div className="min-h-screen relative text-white overflow-hidden">
        {/* Galaxy Background */}
        <div className="fixed inset-0 z-0">
          <Galaxy 
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.2}
            glowIntensity={0.4}
            saturation={0.6}
            hueShift={200}
            speed={0.8}
            twinkleIntensity={0.4}
            rotationSpeed={0.05}
            transparent={true}
          />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-white font-medium">Loading your tasks...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.4}
          saturation={0.6}
          hueShift={200}
          speed={0.8}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          transparent={true}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center py-8 space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  All Tasks
                </h1>
                <p className="text-gray-300 mt-2 text-lg drop-shadow-lg">
                  {loading ? 'Loading tasks...' : `Manage your ${Array.isArray(tasks) ? tasks.length : 'Invalid data'} tasks`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button 
                  onClick={handleCreateClick}
                  className="group w-full sm:w-auto bg-blue-600/80 hover:bg-blue-700/90 text-white border-blue-400/40 hover:border-blue-300/60 hover:scale-105 shadow-lg px-6 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 backdrop-blur-sm border font-semibold"
                >
                  <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Task</span>
                </button>
                <button 
                  onClick={fetchTasks}
                  disabled={operationLoading}
                  className="group w-full sm:w-auto bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:scale-105 shadow-lg px-6 py-3 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 backdrop-blur-sm border font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className={`h-5 w-5 transition-transform duration-500 ${operationLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{operationLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-blue-200 transition-colors duration-300">
                    {Array.isArray(tasks) ? tasks.length : 0}
                  </p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30 group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300">
                  <ChartBarIcon className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-green-200 transition-colors duration-300">
                    {filteredAndSortedTasks.filter(task => task.status === 'Completed').length}
                  </p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-xl border border-green-400/30 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-yellow-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-yellow-200 transition-colors duration-300">
                    {filteredAndSortedTasks.filter(task => task.status === 'In Progress').length}
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/30 group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300">
                  <ClockIcon className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-red-400/40 transition-all duration-300 hover:bg-white/10 group shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-white mt-1 group-hover:text-red-200 transition-colors duration-300">
                    {filteredAndSortedTasks.filter(task => task.priority === 'High').length}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-xl border border-red-400/30 group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="all" className="bg-gray-800 text-white">All Status</option>
                  <option value="To Do" className="bg-gray-800 text-white">To Do</option>
                  <option value="In Progress" className="bg-gray-800 text-white">In Progress</option>
                  <option value="Completed" className="bg-gray-800 text-white">Completed</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="all" className="bg-gray-800 text-white">All Priority</option>
                  <option value="High" className="bg-gray-800 text-white">High</option>
                  <option value="Medium" className="bg-gray-800 text-white">Medium</option>
                  <option value="Low" className="bg-gray-800 text-white">Low</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="dueDate" className="bg-gray-800 text-white">Sort by Due Date</option>
                  <option value="priority" className="bg-gray-800 text-white">Sort by Priority</option>
                  <option value="created" className="bg-gray-800 text-white">Sort by Created</option>
                  <option value="title" className="bg-gray-800 text-white">Sort by Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/50 mb-8 shadow-2xl">
              <h3 className="text-red-300 font-semibold mb-2 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-3" />
                Error Loading Tasks
              </h3>
              <p className="text-white mb-4">{error}</p>
              <button 
                onClick={fetchTasks}
                disabled={operationLoading}
                className="bg-red-600/80 hover:bg-red-700/90 disabled:bg-red-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-red-500/20 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
              >
                {operationLoading ? 'Loading...' : 'Try Again'}
              </button>
            </div>
          )}

          {/* Task List */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FunnelIcon className="h-6 w-6 mr-3 text-blue-400" />
                Tasks ({filteredAndSortedTasks.length})
              </h2>
            </div>
            
            {Array.isArray(tasks) && filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
                  <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <ChartBarIcon className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-gray-300 text-lg mb-2">No tasks found</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {tasks.length === 0 ? 'Create your first task to get started!' : 'Try adjusting your filters'}
                  </p>
                  {tasks.length === 0 && (
                    <button
                      onClick={handleCreateClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Create First Task
                    </button>
                  )}
                </div>
              </div>
            ) : Array.isArray(tasks) ? (
              <div className="space-y-4">
                {filteredAndSortedTasks.map((task, index) => {
                  const statusInfo = getStatusInfo(task.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={task._id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-300 group shadow-lg hover:shadow-xl">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 lg:mr-6">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className={`p-2 rounded-lg border ${statusInfo.color} group-hover:scale-110 transition-all duration-300`}>
                              <StatusIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-200 transition-colors duration-300">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Status and Priority Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <button
                              onClick={() => {
                                if (!task._id) {
                                  console.error('Task has no ID:', task);
                                  alert('Cannot update task: Missing task ID');
                                  return;
                                }
                                
                                const statuses = ['To Do', 'In Progress', 'Completed'];
                                const currentIndex = statuses.indexOf(task.status);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                
                                console.log('Status change:', {
                                  taskId: task._id,
                                  currentStatus: task.status,
                                  nextStatus: nextStatus,
                                  currentIndex: currentIndex
                                });
                                
                                updateTaskStatus(task._id, nextStatus);
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${statusInfo.color}`}
                              title="Click to change status"
                            >
                              {task.status}
                            </button>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${getPriorityColor(task.priority)}`}>
                              {task.priority} Priority
                            </span>
                            {task.category && (
                              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full border border-indigo-400/30 backdrop-blur-sm">
                                {task.category}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              <TagIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                              {task.tags.map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Estimated Time */}
                          {task.estimatedTime && (
                            <div className="flex items-center text-gray-400 text-xs mb-2">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>Estimated: {task.estimatedTime} minutes</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-3 lg:text-right lg:min-w-0 lg:w-48">
                          <div className="flex items-center lg:justify-end text-gray-400 text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span className={`${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-400 font-semibold' : ''}`}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          {task.createdAt && (
                            <div className="flex items-center lg:justify-end text-gray-500 text-xs">
                              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2 lg:justify-end">
                            <button 
                              onClick={() => handleViewClick(task)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-400/30 transition-all duration-300 hover:scale-110"
                              title="View task details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditClick(task)}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg border border-green-400/30 transition-all duration-300 hover:scale-110"
                              title="Edit task"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteTask(task._id)}
                              disabled={operationLoading}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-400/30 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete task"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-8 border border-red-400/50 max-w-md mx-auto">
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-300 text-lg mb-4">Invalid data format received</p>
                  <p className="text-gray-400 text-sm mb-4">Expected an array but got: {typeof tasks}</p>
                  <button 
                    onClick={fetchTasks}
                    disabled={operationLoading}
                    className="bg-red-600/80 hover:bg-red-700/90 disabled:bg-red-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-red-500/20 hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                  >
                    {operationLoading ? 'Loading...' : 'Try Again'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskFormModal 
        show={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedTask(null);
          resetForm();
        }}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        onSubmit={handleSubmit}
      />

      <ViewTaskModal 
        show={showViewModal}
        task={selectedTask}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};

export default AllTasksPage;