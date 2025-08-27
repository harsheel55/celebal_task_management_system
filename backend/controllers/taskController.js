// backend/controllers/taskController.js
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    console.log('=== CREATE TASK CONTROLLER ===');
    console.log('Request body:', req.body);
    console.log('User from req:', req.user);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors in controller:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    // Check if user exists
    if (!req.user) {
      console.log('ERROR: No user found in request object');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Extract user ID with multiple fallbacks
    const userId = req.user.id || req.user._id || req.user.userId;
    console.log('Extracted user ID:', userId);
    console.log('User ID type:', typeof userId);

    if (!userId) {
      console.log('ERROR: Could not extract valid user ID from:', req.user);
      return res.status(401).json({ 
        message: 'Invalid user authentication data',
        debug: process.env.NODE_ENV === 'development' ? { user: req.user } : undefined
      });
    }

    const { 
      title, 
      description, 
      status, 
      priority, 
      dueDate, 
      category, 
      tags, 
      estimatedTime 
    } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      console.log('ERROR: Title is missing or empty');
      return res.status(400).json({ message: 'Title is required' });
    }

    // Set defaults and validate enum values
    const taskStatus = status || 'To Do';
    const taskPriority = priority || 'Medium';

    // Validate status enum
    const validStatuses = ['To Do', 'In Progress', 'Completed'];
    if (!validStatuses.includes(taskStatus)) {
      console.log('ERROR: Invalid status:', taskStatus);
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        received: taskStatus
      });
    }

    // Validate priority enum
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(taskPriority)) {
      console.log('ERROR: Invalid priority:', taskPriority);
      return res.status(400).json({ 
        message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
        received: taskPriority
      });
    }

    console.log('Creating task with validated data:', {
      title: title.trim(),
      description: description?.trim(),
      status: taskStatus,
      priority: taskPriority,
      dueDate,
      userId
    });

    const newTask = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      status: taskStatus,
      priority: taskPriority,
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category?.trim(),
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
      estimatedTime,
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Task object before save:', {
      title: newTask.title,
      user: newTask.user,
      status: newTask.status,
      priority: newTask.priority
    });

    const savedTask = await newTask.save();
    console.log('Task saved successfully with ID:', savedTask._id);

    // Return the saved task
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    });

  } catch (error) {
    console.error('=== CREATE TASK ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation errors:', error.errors);
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('Duplicate key error:', error.keyPattern);
      return res.status(400).json({
        message: 'Duplicate entry detected',
        field: Object.keys(error.keyPattern)[0]
      });
    }

    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === 'CastError') {
      console.log('Cast error:', error.path, error.value);
      return res.status(400).json({
        message: `Invalid ${error.path}: ${error.value}`
      });
    }

    // Generic server error
    res.status(500).json({
      message: 'Server error while creating task',
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : 'Internal server error'
    });
  }
};

// @desc    Get all tasks for a user with filtering and pagination
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    console.log('=== GET ALL TASKS CONTROLLER ===');
    
    const { 
      status, 
      priority, 
      search, 
      page = 1, 
      limit = 50, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Handle different auth middleware implementations
    const userId = req.user.id || req.user._id || req.user.userId;
    console.log('Getting tasks for user:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }

    const filter = { user: userId, isArchived: { $ne: true } };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    console.log('Query filter:', filter);
    console.log('Sort options:', sort);

    const tasks = await Task.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Task.countDocuments(filter);

    console.log(`Found ${tasks.length} tasks out of ${total} total`);

    res.json({
      success: true,
      tasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalTasks: total,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      message: 'Server error while getting tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    console.log('=== UPDATE TASK CONTROLLER ===');
    console.log('Task ID:', req.params.id);
    console.log('Update data:', req.body);

    const userId = req.user.id || req.user._id || req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }

    // Validate enum values if they're being updated
    if (req.body.status && !['To Do', 'In Progress', 'Completed'].includes(req.body.status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: To Do, In Progress, Completed' 
      });
    }

    if (req.body.priority && !['Low', 'Medium', 'High'].includes(req.body.priority)) {
      return res.status(400).json({ 
        message: 'Invalid priority. Must be one of: Low, Medium, High' 
      });
    }
    
    const updateData = { 
      ...req.body, 
      updatedAt: new Date() 
    };

    // Remove any undefined or null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    console.log('Task updated successfully:', task._id);
    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update only a task's status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    console.log('=== UPDATE TASK STATUS CONTROLLER ===');
    
    const { status } = req.body;
    const userId = req.user.id || req.user._id || req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Validate that status is one of the allowed enum values
    const validStatuses = ['To Do', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: { status, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    console.log('Task status updated successfully:', task._id);
    res.json({
      success: true,
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating task status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    console.log('=== DELETE TASK CONTROLLER ===');
    
    const userId = req.user.id || req.user._id || req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }
    
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }

    console.log('Task deleted successfully:', task._id);
    res.json({ 
      success: true,
      message: 'Task deleted successfully',
      deletedTask: { id: task._id, title: task.title }
    });
  } catch (error) {
    console.error('Delete task error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    res.status(500).json({ 
      message: 'Server error while deleting task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
};