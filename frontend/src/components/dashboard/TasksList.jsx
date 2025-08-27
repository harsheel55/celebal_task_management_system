// frontend/src/components/dashboard/TasksList.jsx
import React from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast

const TasksList = ({ tasks, onTaskUpdate }) => {
  // NEW FUNCTION to handle API call
  const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'To Do' : 'Completed';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Tell the dashboard to refresh its data
      onTaskUpdate();
    } catch (error) {
      toast.error('Failed to update task status.');
      console.error('Update error:', error);
    }
  };

  if (tasks.length === 0) {
    // ... your existing empty state code
    return (
      <div className="text-center py-8 text-gray-500">
        <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No tasks scheduled for today</p>
        <p className="text-sm">Great job staying on top of things!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task._id} /* ... your existing div styling */>
          {/* UPDATED BUTTON with onClick handler */}
          <button 
            className="flex-shrink-0" 
            onClick={() => handleStatusChange(task._id, task.status)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              task.status === 'Completed'
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-400'
            }`}>
              {task.status === 'Completed' && (
                <CheckIcon className="h-3 w-3 text-white" />
              )}
            </div>
          </button>
          
          {/* ... The rest of your task item JSX is perfect */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className={`text-sm font-medium ${
                task.status === 'Completed' ? 'line-through text-gray-500' : 'text-white'
              }`}>
                {task.title}
              </p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority}
              </span>
            </div>
            {/* ... etc */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksList;