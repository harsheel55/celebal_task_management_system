const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('firstName', 'First name is required').not().isEmpty().trim(),
    body('lastName', 'Last name is required').not().isEmpty().trim(),
    body('username', 'Username is required').not().isEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('=== REGISTRATION REQUEST DEBUG ===');
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, username, email, password } = req.body;
    
    console.log('Extracted fields:', { 
      firstName, 
      lastName, 
      username, 
      email, 
      password: '***' 
    });

    try {
      // Check if user already exists by email
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Check if username is already taken
      let existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        console.log('Username already taken:', username);
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Create user - password will be hashed by the pre-save hook
      const user = new User({ 
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.toLowerCase(),
        password: password
      });

      console.log('About to save user:', {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      });

      await user.save();
      console.log('User created successfully with ID:', user.id);

      const payload = { userId: user.id };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }
        
        console.log('Registration successful for:', email);
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
          },
        });
      });
    } catch (err) {
      console.error('Registration error:', err.message);
      console.error('Full error:', err);
      
      // Handle specific MongoDB errors
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = field === 'email' 
          ? 'User already exists' 
          : `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        return res.status(400).json({ message });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    console.log('=== LOGIN REQUEST DEBUG ===');
    console.log('Login attempt for email:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log('User not found with email:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('User found, checking password...');

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Password match successful for user:', email);

      // Create JWT payload
      const payload = {
        userId: user.id,
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            console.error('JWT sign error during login:', err);
            return res.status(500).json({ message: 'Error generating token' });
          }
          
          console.log('Login successful for:', email);
          res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              name: user.name || `${user.firstName} ${user.lastName}`,
              username: user.username,
              email: user.email,
            },
          });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      console.error('Full login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @route   POST api/auth/forgot-password
// @desc    Request a password reset link
// @access  Public
router.post('/forgot-password', [body('email').isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(200).json({ 
        message: 'If a user with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password for your TaskMaster account.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'TaskMaster Password Reset Request',
      message,
    });

    res.status(200).json({ message: 'A password reset link has been sent to your email.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Password reset token is invalid or has expired.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Create new JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      success: true,
      message: 'Password has been reset successfully.', 
      token: jwtToken 
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;