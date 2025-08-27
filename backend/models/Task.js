// backend/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'], // Using 'Completed' for consistency
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  dueDate: {
    type: Date,
  },
  // --- Fields added to match your form ---
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  tags: {
    type: [String] // Stores an array of strings
  },
  estimatedTime: {
    type: Number, // Stores time in minutes
    required: false
  },
  // --- End of added fields ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;