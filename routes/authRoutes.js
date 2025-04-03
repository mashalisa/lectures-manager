const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const { auth, isAdmin, isTeacher, requireRole } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the user
 *         password:
 *           type: string
 *           format: password
 *           description: Hashed password of the user
 *         role:
 *           type: string
 *           enum: [user, admin, teacher, manager, student]
 *           default: student
 *           description: Role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [user, admin, teacher, manager, student]
 *                 default: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */


// User Registration
router.post('/register', auth, requireRole , async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: username, email, and password' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine user role based on email domain
        let userRole = role || 'student';
        if (email.endsWith("@realtimecollege.com")) {
            userRole = 'teacher';  // Override role to 'manager' for @realtimecollege.com emails
        }

        const user = new User({
            username,
            email,
            password,
            role: userRole
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
});

/**
 * @swagger
 * /auth/register-admin:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the admin
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email for the admin
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the admin
 *     responses:
 *       201:
 *         description: Admin user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */
// Admin Registration
router.post('/register-admin', auth, isAdmin, async (req, res) => {
    // router.post('/register-admin',  async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: username, email, and password' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (email.endsWith("@realtimecollege")) {
            userRole = 'admin';  // Override role to 'teacher' for @realtimecollege.com emails
        }
        
        // Create new user - password will be hashed by the pre-save middleware
        const user = new User({
            username,
            email,
            password,
            role: 'admin'
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 */
// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Send single response with token and user data
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});





module.exports = router;