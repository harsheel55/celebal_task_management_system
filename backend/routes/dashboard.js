// backend/routes/dashboard.js
const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    console.log('=== DASHBOARD STATS DEBUG ===');
    console.log('User ID:', userId);
    console.log('Date ranges:', { startOfDay, endOfDay, startOfWeek });

    // First, let's see what statuses we actually have in the database
    const statusCheck = await Task.distinct('status', { user: userId });
    console.log('Available statuses in database:', statusCheck);

    const [
      totalTasks,
      completedTasks,
      todayTasks,
      overdueTasks,
      thisWeekTasks,
      highPriorityTasks,
      recentTasks,
      tasksByStatus,
      tasksByPriority
    ] = await Promise.all([
      // Total tasks
      Task.countDocuments({ user: userId, isArchived: { $ne: true } }),
      
      // Completed tasks - FIXED: Check for both possible status values
      Task.countDocuments({ 
        user: userId, 
        $or: [
          { status: 'completed' },      // lowercase
          { status: 'Completed' },      // capitalized
          { status: 'COMPLETED' }       // uppercase
        ],
        isArchived: { $ne: true } 
      }),
      
      // Today's tasks
      Task.countDocuments({ 
        user: userId, 
        dueDate: { $gte: startOfDay, $lte: endOfDay },
        isArchived: { $ne: true }
      }),
      
      // Overdue tasks - FIXED: Exclude all completed variations
      Task.countDocuments({ 
        user: userId, 
        dueDate: { $lt: new Date() },
        status: { 
          $nin: ['completed', 'Completed', 'COMPLETED'] 
        },
        isArchived: { $ne: true }
      }),
      
      // This week's tasks
      Task.countDocuments({ 
        user: userId, 
        dueDate: { $gte: startOfWeek },
        isArchived: { $ne: true }
      }),
      
      // High priority tasks - FIXED: Check for both case variations
      Task.countDocuments({ 
        user: userId, 
        $or: [
          { priority: 'high' },
          { priority: 'High' },
          { priority: 'HIGH' }
        ],
        status: { 
          $nin: ['completed', 'Completed', 'COMPLETED'] 
        },
        isArchived: { $ne: true }
      }),
      
      // Recent tasks (last 5)
      Task.find({ user: userId, isArchived: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status priority dueDate createdAt'),
      
      // Tasks by status - FIXED: Normalize status values for aggregation
      Task.aggregate([
        { $match: { user: userId, isArchived: { $ne: true } } },
        { 
          $addFields: { 
            normalizedStatus: {
              $switch: {
                branches: [
                  { case: { $in: ['$status', ['completed', 'Completed', 'COMPLETED']] }, then: 'completed' },
                  { case: { $in: ['$status', ['in-progress', 'In Progress', 'IN-PROGRESS', 'in progress']] }, then: 'in-progress' },
                  { case: { $in: ['$status', ['pending', 'Pending', 'PENDING', 'to-do', 'To Do', 'TO-DO', 'todo']] }, then: 'pending' }
                ],
                default: 'pending'
              }
            }
          }
        },
        { $group: { _id: '$normalizedStatus', count: { $sum: 1 } } }
      ]),
      
      // Tasks by priority - FIXED: Normalize priority values
      Task.aggregate([
        { 
          $match: { 
            user: userId, 
            status: { 
              $nin: ['completed', 'Completed', 'COMPLETED'] 
            }, 
            isArchived: { $ne: true } 
          } 
        },
        { 
          $addFields: { 
            normalizedPriority: {
              $switch: {
                branches: [
                  { case: { $in: ['$priority', ['low', 'Low', 'LOW']] }, then: 'low' },
                  { case: { $in: ['$priority', ['medium', 'Medium', 'MEDIUM']] }, then: 'medium' },
                  { case: { $in: ['$priority', ['high', 'High', 'HIGH']] }, then: 'high' }
                ],
                default: 'medium'
              }
            }
          }
        },
        { $group: { _id: '$normalizedPriority', count: { $sum: 1 } } }
      ])
    ]);

    console.log('=== DASHBOARD COUNTS ===');
    console.log('Total tasks:', totalTasks);
    console.log('Completed tasks:', completedTasks);
    console.log('Today tasks:', todayTasks);
    console.log('Overdue tasks:', overdueTasks);
    console.log('Tasks by status:', tasksByStatus);
    console.log('Tasks by priority:', tasksByPriority);

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Format status and priority data
    const statusData = tasksByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { pending: 0, 'in-progress': 0, completed: 0 });

    const priorityData = tasksByPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    console.log('=== FORMATTED DATA ===');
    console.log('Status data:', statusData);
    console.log('Priority data:', priorityData);
    console.log('Completion rate:', completionRate);

    res.json({
      overview: {
        totalTasks,
        completedTasks,
        todayTasks,
        overdueTasks,
        thisWeekTasks,
        highPriorityTasks,
        completionRate
      },
      chartData: {
        tasksByStatus: statusData,
        tasksByPriority: priorityData
      },
      recentActivity: recentTasks
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while getting dashboard stats' });
  }
});

// Get today's tasks for quick view
router.get('/today-tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    console.log('=== TODAY TASKS DEBUG ===');
    console.log('User ID:', userId);
    console.log('Date range:', { startOfDay, endOfDay });

    const todayTasks = await Task.find({
      user: userId,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
      isArchived: { $ne: true }
    })
    .sort({ 
      // Sort by priority (High, Medium, Low) then by creation date
      priority: -1, 
      createdAt: 1 
    })
    .limit(10)
    .select('title status priority dueDate createdAt description');

    console.log('Found today tasks:', todayTasks.length);
    console.log('Today tasks sample:', todayTasks.slice(0, 2));

    res.json(todayTasks);
  } catch (error) {
    console.error('Today tasks error:', error);
    res.status(500).json({ message: 'Server error while getting today tasks' });
  }
});

// Debug endpoint to check task statuses (remove in production)
router.get('/debug-statuses', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId;
    
    const statusBreakdown = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const priorityBreakdown = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sampleTasks = await Task.find({ user: userId })
      .limit(5)
      .select('title status priority createdAt');

    res.json({
      message: 'Debug info for task statuses',
      statusBreakdown,
      priorityBreakdown,
      sampleTasks,
      totalTasks: await Task.countDocuments({ user: userId })
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Debug error' });
  }
});

module.exports = router;