// backend/routes/tasks.js
const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Import controllers
const {
  createTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController.js");

// Enhanced validation middleware for better error messages
const validateTaskCreation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("status")
    .optional()
    .isIn(['To Do', 'In Progress', 'Completed'])
    .withMessage("Status must be one of: To Do, In Progress, Completed"),
  body("priority")
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be one of: Low, Medium, High"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

// Debug middleware to log request details
const debugMiddleware = (req, res, next) => {
  console.log('=== Task Route Debug Info ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', {
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    'content-type': req.headers['content-type']
  });
  console.log('Body:', req.body);
  console.log('User from auth middleware:', req.user ? {
    id: req.user.id || req.user._id || req.user.userId,
    email: req.user.email
  } : 'No user found');
  console.log('==============================');
  next();
};

// Enhanced error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
};

// Routes with enhanced debugging
router
  .route("/")
  .get(authMiddleware, debugMiddleware, getAllTasks)
  .post(
    authMiddleware,
    debugMiddleware,
    validateTaskCreation,
    handleValidationErrors,
    createTask
  );

router
  .route("/:id")
  .put(authMiddleware, debugMiddleware, updateTask)
  .delete(authMiddleware, debugMiddleware, deleteTask);

router
  .route("/:id/status")
  .patch(authMiddleware, debugMiddleware, updateTaskStatus);

// Alternative inline handlers for debugging (uncomment if needed)
/*
// Create task with enhanced debugging
router.post(
  "/",
  authMiddleware,
  debugMiddleware,
  validateTaskCreation,
  async (req, res) => {
    try {
      console.log('=== CREATE TASK HANDLER ===');
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ 
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      // Check if user exists
      if (!req.user) {
        console.log('ERROR: No user found in request');
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const userId = req.user.id || req.user._id || req.user.userId;
      console.log('User ID extracted:', userId);

      if (!userId) {
        console.log('ERROR: Could not extract user ID');
        return res.status(401).json({ message: 'Invalid user data' });
      }

      const { title, description, status, priority, dueDate, category, tags, estimatedTime } = req.body;
      
      console.log('Creating task with data:', {
        title,
        description,
        status: status || 'To Do',
        priority: priority || 'Medium',
        dueDate,
        userId
      });

      const newTask = new Task({
        title,
        description,
        status: status || 'To Do',
        priority: priority || 'Medium',
        dueDate: dueDate || null,
        category,
        tags,
        estimatedTime,
        user: userId,
      });

      const savedTask = await newTask.save();
      console.log('Task saved successfully:', savedTask._id);
      
      res.status(201).json(savedTask);
    } catch (error) {
      console.error("Create task error:", error);
      
      if (error.name === "ValidationError") {
        console.log('Mongoose validation error:', error.errors);
        return res.status(400).json({ 
          message: 'Validation error', 
          details: error.message,
          errors: Object.keys(error.errors).map(key => ({
            field: key,
            message: error.errors[key].message
          }))
        });
      }
      
      if (error.code === 11000) {
        console.log('Duplicate key error:', error.keyPattern);
        return res.status(400).json({ 
          message: 'Duplicate entry',
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        message: "Server error while creating task",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);
*/

module.exports = router;