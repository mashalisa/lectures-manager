const express = require('express');
const router = express.Router();
const Lecture = require('../models/lecture');
const { auth, isAdmin, isTeacher, requireRole } = require('../middleware/auth');

// Swagger CRUD annotations

/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: CRUD operations for managing lectures
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lecture:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the lecture (not required in POST request)
 *         title:
 *           type: string
 *           description: Title of the lecture
 *         description:
 *           type: string
 *           description: Description of the lecture
 *         category:
 *           type: string
 *           enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *           description: Category of the lecture
 *         date:
 *           type: string
 *           format: date-time
 *           description: Creation date of the lecture (auto-generated if not provided)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [Lectures]
 *     description: Returns a welcome message for the API
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /lectures:
 *   get:
 *     summary: Get all lectures with pagination and filtering
 *     tags: [Lectures]
 *     description: Retrieve a list of lectures with optional pagination and category filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *         description: Filter lectures by category
 *     responses:
 *       200:
 *         description: List of lectures with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lectures:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lecture'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 * 
  */

/**
 * @swagger
 * /lectures:
 *   post:
 *     summary: Create a new lecture. only  Admin or Teacher access
 *     tags: [Lectures]
 *     description: Create a new lecture in the database (ID will be auto-generated)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the lecture
 *               description:
 *                 type: string
 *                 description: Description of the lecture
 *               category:
 *                 type: string
 *                 enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *                 description: Category of the lecture
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Creation date (optional, defaults to current date)
 *     responses:
 *       201:
 *         description: Lecture created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /lectures/{id}:
 *   get:
 *     summary: Get a lecture by ID. 
 *     tags: [Lectures]
 *     description: Retrieve a specific lecture by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: Lecture not found
  */

/**
 * @swagger
 * /lectures/{id}:
 *   put:
 *     summary: Update a lecture. only  Admin or Teacher access
 *     tags: [Lectures]
 *     description: Update an existing lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lecture'
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: Lecture not found
 *       400:
 *         description: Invalid input data
 *
  */

/**
 * @swagger
 * /lectures/{id}:
 *   delete:
 *     summary: Delete a lecture.  only  Admin or Teacher access
 *     tags: [Lectures]
 *     description: Delete a lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
 *       404:
 *         description: Lecture not found
 */



/**
 * @swagger
 * /lectures:
 *   get:
 *     tags: [Lectures]
 *     summary: Get all lectures
 *     responses:
 *       200:
 *         description: A list of all lectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */

// Get all lectures with pagination and filtering
router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const category = req.query.category;
  
      const query = category ? { category } : {};
  
      const total = await Lecture.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const lectures = await Lecture.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({
        lectures,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get lecture by ID
  router.get('/:id', async (req, res) => {
    try {
      const lecture = await Lecture.findById(req.params.id);
      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }
      res.json(lecture);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create new lecture
  router.post('/', auth, requireRole, async (req, res) => {
    try {
      const lecture = new Lecture(req.body);
      await lecture.save();
      res.status(201).json(lecture);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update lecture
  router.put('/:id', auth, requireRole, async (req, res) => {
    try {
      const lecture = await Lecture.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }
      res.json(lecture);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete lecture
  router.delete('/:id', auth, requireRole, async (req, res) => {
    try {
      const lecture = await Lecture.findByIdAndDelete(req.params.id);
      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }
      res.json({ message: 'Lecture deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router; 