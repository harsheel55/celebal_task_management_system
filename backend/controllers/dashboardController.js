// backend/controllers/dashboardController.js

const Task = require('../models/Task.js');
const asyncHandler = require('express-async-handler');

// @desc    Get all dashboard data (stats, charts, activity)
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. Fetch all tasks for the user once. This is efficient.
  const allUserTasks = await Task.find({ user: userId });

  // 2. Calculate Overview Stats
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const totalTasks = allUserTasks.length;
  const completedTasks = allUserTasks.filter(task => task.status === 'Completed').length;
  const overdueTasks = allUserTasks.filter(
    task => task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < todayStart
  ).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // 3. NEW: Aggregate data for charts, matching the frontend component's needs
  const initialStatusData = { todo: 0, 'in-progress': 0, completed: 0 };
  const tasksByStatus = allUserTasks.reduce((acc, task) => {
    if (task.status === 'To Do') acc.todo++;
    if (task.status === 'In Progress') acc['in-progress']++;
    if (task.status === 'Completed') acc.completed++;
    return acc;
  }, initialStatusData);

  const initialPriorityData = { low: 0, medium: 0, high: 0 };
  const tasksByPriority = allUserTasks.reduce((acc, task) => {
    const priorityKey = task.priority.toLowerCase(); // Ensure lowercase keys
    if (priorityKey in acc) {
      acc[priorityKey]++;
    }
    return acc;
  }, initialPriorityData);

  // 4. Get recent activity
  const recentActivity = await Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

  // 5. Assemble the final response object in the exact shape the frontend needs
  res.json({
    overview: {
      totalTasks,
      completedTasks,
      // Note: your DashboardPage gets today's task count from today-tasks endpoint length
      // but we can provide it here too for consistency if needed.
      overdueTasks,
      completionRate
    },
    chartData: { // This is the new structure for your ProductivityChart
      tasksByStatus,
      tasksByPriority,
    },
    recentActivity: recentActivity 
  });
});

// @desc    Get tasks due today
// @route   GET /api/dashboard/today-tasks
// @access  Private
const getTodayTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  const tasks = await Task.find({ 
    user: userId, 
    dueDate: { $gte: todayStart, $lte: todayEnd },
    // status: { $ne: 'Completed' } // Show all for today, including completed ones
  }).sort({ status: 1, priority: -1 }); // Sort to show incomplete first

  // UPDATED: Ensure priority is lowercase to match frontend component
  const formattedTasks = tasks.map(task => {
    const taskObject = task.toObject();
    return {
        ...taskObject,
        priority: taskObject.priority.toLowerCase(),
    };
  });

  res.json(formattedTasks);
});

module.exports = {
  getDashboardStats,
  getTodayTasks
};