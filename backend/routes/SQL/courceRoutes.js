const express = require('express');
const router = express.Router();
const { Lecture } = require('../../configSQL/database');
const { auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - lecture_name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the lecture
 *         lecture_name:
 *           type: string
 *           description: The name of the lecture
 *         description:
 *           type: string
 *           description: The description of the lecture
 *         category:
 *           type: string
 *           description: The category of the lecture
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Returns all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Lecture.findAll();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by id
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: The course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const course = await Lecture.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
});

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new lecture
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lecture_name
 *             properties:
 *               lecture_name:
 *                 type: string
 *                 description: The name of the lecture
 *               description:
 *                 type: string
 *                 description: The description of the lecture
 *               category:
 *                 type: string
 *                 description: The category of the lecture
 *     responses:
 *       201:
 *         description: The created lecture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    try {
        const { lecture_name, description, category } = req.body;
        
        if (!lecture_name) {
            return res.status(400).json({ message: 'lecture_name is required' });
        }

        const newCourse = await Lecture.create({
            lecture_name,
            description,
            category
        });

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a lecture
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lecture id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lecture_name:
 *                 type: string
 *                 description: The name of the lecture
 *               category:
 *                 type: string
 *                 description: The category of the lecture
 *     responses:
 *       200:
 *         description: The updated lecture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Lecture not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { lecture_name, category } = req.body;
        const lectureId = req.params.id;

        // Check if lecture exists
        const lecture = await Lecture.findByPk(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Update lecture with only the fields that are present in the model
        const updatedLecture = await lecture.update({
            lecture_name: lecture_name || lecture.lecture_name,
            category: category || lecture.category
        });

        res.status(200).json(updatedLecture);
    } catch (error) {
        console.error('Error updating lecture:', error);
        res.status(500).json({ message: 'Error updating lecture', error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Lecture.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.destroy();

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
});

module.exports = router;