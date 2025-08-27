// frontend/src/components/dashboard/DragDropCalendar.jsx
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  ClockIcon,
  TagIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskModal from './TaskModal';
import QuickTaskForm from './QuickTaskForm';

const DragDropCalendar = ({ tasks = [], onTaskUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month', 'day'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // Filter and organize tasks by date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    }).sort((a, b) => {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return timeA - timeB;
    });
  };

  // Get week dates
  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      weekDates.push(currentDay);
    }
    return weekDates;
  };

  // Get month dates
  const getMonthDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Start from Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End on Saturday of the week containing the last day
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const dates = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  // Navigation handlers
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetDate) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    try {
      const token = localStorage.getItem('token');
      const updatedTask = {
        ...draggedTask,
        dueDate: new Date(targetDate.setHours(
          draggedTask.dueDate ? new Date(draggedTask.dueDate).getHours() : 9,
          draggedTask.dueDate ? new Date(draggedTask.dueDate).getMinutes() : 0
        )).toISOString()
      };

      await axios.put(`http://localhost:5000/api/tasks/${draggedTask._id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Task moved successfully');
      onTaskUpdate && onTaskUpdate();
    } catch (error) {
      toast.error('Failed to move task');
      console.error('Move task error:', error);
    }

    setDraggedTask(null);
  };

  // Task handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleQuickAdd = (date) => {
    setQuickAddDate(date);
    setShowQuickAdd(true);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in progress': return 'bg-yellow-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  // Render methods
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {/* Week headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        
        {/* Week days */}
        {weekDates.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[120px] sm:min-h-[200px] p-1 sm:p-2 border border-gray-200 ${
                isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <span className={`text-xs sm:text-sm font-medium ${
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </span>
                <button
                  onClick={() => handleQuickAdd(date)}
                  className="p-0.5 sm:p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                {dayTasks.slice(0, viewMode === 'week' ? 4 : 2).map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => handleTaskClick(task)}
                    className={`p-1 sm:p-2 rounded text-xs border cursor-pointer hover:shadow-sm transition-shadow ${
                      getPriorityColor(task.priority)
                    }`}
                  >
                    <div className="flex items-center space-x-1 mb-0.5 sm:mb-1">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(task.status)}`} />
                      <span className="truncate flex-1 font-medium text-xs">{task.title}</span>
                    </div>
                    
                    {task.dueDate && (
                      <div className="hidden sm:flex items-center space-x-1 text-gray-600">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatTime(task.dueDate)}</span>
                      </div>
                    )}
                    
                    {task.category && (
                      <div className="hidden sm:flex items-center space-x-1 text-gray-600 mt-1">
                        <TagIcon className="h-3 w-3" />
                        <span className="truncate">{task.category}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {dayTasks.length > (viewMode === 'week' ? 4 : 2) && (
                  <div className="text-xs text-gray-500 text-center py-0.5 sm:py-1">
                    +{dayTasks.length - (viewMode === 'week' ? 4 : 2)} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDates = getMonthDates(currentDate);
    const currentMonth = currentDate.getMonth();
    
    return (
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {/* Month headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        
        {/* Month days */}
        {monthDates.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = date.getMonth() === currentMonth;
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[80px] sm:min-h-[120px] p-0.5 sm:p-1 border border-gray-200 ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' :
                isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                <span className={`text-xs sm:text-sm ${
                  isToday ? 'font-bold text-blue-600' : 
                  isCurrentMonth ? 'font-medium text-gray-900' : 'text-gray-400'
                }`}>
                  {date.getDate()}
                </span>
                {isCurrentMonth && (
                  <button
                    onClick={() => handleQuickAdd(date)}
                    className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <PlusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                )}
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => handleTaskClick(task)}
                    className="p-0.5 sm:p-1 rounded text-xs bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${getStatusColor(task.status)}`} />
                      <span className="truncate text-xs">{task.title}</span>
                    </div>
                  </div>
                ))}
                
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayTasks.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-1">
          {hours.map((hour) => {
            const hourTasks = dayTasks.filter(task => {
              if (!task.dueDate) return false;
              return new Date(task.dueDate).getHours() === hour;
            });
            
            return (
              <div key={hour} className="flex border-b border-gray-100">
                <div className="w-12 sm:w-16 p-1 sm:p-2 text-xs sm:text-sm text-gray-500 font-medium">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div
                  className="flex-1 min-h-[50px] sm:min-h-[60px] p-1 sm:p-2 hover:bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setHours(hour, 0, 0, 0);
                    handleDrop(e, newDate);
                  }}
                >
                  <div className="space-y-1">
                    {hourTasks.map((task) => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => handleTaskClick(task)}
                        className={`p-1 sm:p-2 rounded border cursor-pointer hover:shadow-sm ${
                          getPriorityColor(task.priority)
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getStatusColor(task.status)}`} />
                            <span className="font-medium text-xs sm:text-sm">{task.title}</span>
                          </div>
                          <span className="text-xs text-gray-600">
                            {formatTime(task.dueDate)}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        {task.category && (
                          <div className="flex items-center space-x-1 mt-1 sm:mt-2">
                            <TagIcon className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{task.category}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Calendar Header */}
      <div className="p-2 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              
              <h2 className="text-sm sm:text-xl font-semibold text-gray-900 min-w-0">
                {viewMode === 'month' 
                  ? currentDate.toLocaleDateString('en-US', { 
                      month: window.innerWidth < 640 ? 'short' : 'long', 
                      year: 'numeric' 
                    })
                  : viewMode === 'week'
                  ? `${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}`
                  : currentDate.toLocaleDateString('en-US', { 
                      weekday: window.innerWidth < 640 ? 'short' : 'long', 
                      month: 'short', 
                      day: 'numeric'
                    })
                }
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Today
            </button>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Task count and legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 sm:mt-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span>{tasks.length} tasks</span>
            <div className="hidden sm:flex items-center space-x-2">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Drag to reschedule</span>
            </div>
          </div>
          
          {/* Priority Legend */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-red-200 border border-red-300"></div>
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-yellow-200 border border-yellow-300"></div>
              <span className="text-xs">Med</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded bg-green-200 border border-green-300"></div>
              <span className="text-xs">Low</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Content */}
      <div className="p-1 sm:p-4">
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'day' && renderDayView()}
      </div>
      
      {/* Modals */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdate={onTaskUpdate}
        />
      )}
      
      {showQuickAdd && (
        <QuickTaskForm
          onClose={() => {
            setShowQuickAdd(false);
            setQuickAddDate(null);
          }}
          onTaskCreated={() => {
            setShowQuickAdd(false);
            setQuickAddDate(null);
            onTaskUpdate && onTaskUpdate();
          }}
          initialDate={quickAddDate}
        />
      )}
    </div>
  );
};

export default DragDropCalendar;