const express = require('express');
const router = express.Router();
const { LectureSession, Lecture } = require('../../configSQL/database');
const { auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     LectureSession:
 *       type: object
 *       required:
 *         - lecture_id
 *         - session_time
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the lecture session
 *         lecture_id:
 *           type: integer
 *           description: The ID of the associated lecture
 *         session_time:
 *           type: string
 *           format: date-time
 *           description: The date and time of the lecture session
 *         capacity:
 *           type: integer
 *           description: Maximum number of students for the session
 */

/**
 * @swagger
 * /api/lecture-sessions:
 *   get:
 *     summary: Get all lecture sessions
 *     tags: [Lecture Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all lecture sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LectureSession'
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await LectureSession.findAll({
            include: [{
                model: Lecture,
                attributes: ['lecture_name']
            }]
        });
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching lecture sessions:', error);
        res.status(500).json({ message: 'Error fetching lecture sessions', error: error.message });
    }
});

/**
 * @swagger
 * /api/lecture-sessions/{id}:
 *   get:
 *     summary: Get a lecture session by id
 *     tags: [Lecture Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lecture session id
 *     responses:
 *       200:
 *         description: The lecture session details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureSession'
 *       404:
 *         description: Lecture session not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const session = await LectureSession.findByPk(req.params.id, {
            include: [{
                model: Lecture,
                attributes: ['lecture_name']
            }]
        });
        if (!session) {
            return res.status(404).json({ message: 'Lecture session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching lecture session:', error);
        res.status(500).json({ message: 'Error fetching lecture session', error: error.message });
    }
});

/**
 * @swagger
 * /api/lecture-sessions:
 *   post:
 *     summary: Create a new lecture session
 *     tags: [Lecture Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lecture_id
 *               - session_time
 *               - capacity
 *             properties:
 *               lecture_id:
 *                 type: integer
 *               session_time:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created lecture session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureSession'
 *       400:
 *         description: Invalid input or lecture not found
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    try {
        const { lecture_id, session_time, capacity } = req.body;

        // Validate required fields
        if (!lecture_id || !session_time || !capacity) {
            return res.status(400).json({ 
                message: 'All fields are required: lecture_id, session_time, capacity' 
            });
        }

        // Validate that the lecture exists
        const lecture = await Lecture.findByPk(lecture_id);
        if (!lecture) {
            return res.status(400).json({ message: 'Lecture not found' });
        }

        // Validate capacity is positive
        if (capacity <= 0) {
            return res.status(400).json({ message: 'Capacity must be greater than 0' });
        }

        const newSession = await LectureSession.create({
            lecture_id,
            session_time: new Date(session_time),
            capacity
        });

        res.status(201).json(newSession);
    } catch (error) {
        console.error('Error creating lecture session:', error);
        res.status(500).json({ message: 'Error creating lecture session', error: error.message });
    }
});

/**
 * @swagger
 * /api/lecture-sessions/{id}:
 *   put:
 *     summary: Update a lecture session
 *     tags: [Lecture Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lecture session id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lecture_id:
 *                 type: integer
 *                 description: The ID of the associated lecture
 *               session_time:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated lecture session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LectureSession'
 *       404:
 *         description: Lecture session not found or Lecture not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { lecture_id, session_time, capacity } = req.body;
        const sessionId = req.params.id;

        // Check if session exists
        const session = await LectureSession.findByPk(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Lecture session not found' });
        }

        // If lecture_id is provided, validate that the lecture exists
        if (lecture_id) {
            const lecture = await Lecture.findByPk(lecture_id);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }
        }

        // Validate capacity if provided
        if (capacity !== undefined && capacity <= 0) {
            return res.status(400).json({ message: 'Capacity must be greater than 0' });
        }

        // Update session
        const updatedSession = await session.update({
            lecture_id: lecture_id || session.lecture_id,
            session_time: session_time ? new Date(session_time) : session.session_time,
            capacity: capacity || session.capacity
        });

        // Fetch the updated session with lecture details
        const sessionWithLecture = await LectureSession.findByPk(sessionId, {
            include: [{
                model: Lecture,
                attributes: ['lecture_name']
            }]
        });

        res.status(200).json(sessionWithLecture);
    } catch (error) {
        console.error('Error updating lecture session:', error);
        res.status(500).json({ message: 'Error updating lecture session', error: error.message });
    }
});

/**
 * @swagger
 * /api/lecture-sessions/{id}:
 *   delete:
 *     summary: Delete a lecture session
 *     tags: [Lecture Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The lecture session id
 *     responses:
 *       200:
 *         description: Lecture session deleted successfully
 *       404:
 *         description: Lecture session not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const sessionId = req.params.id;

        // Check if session exists
        const session = await LectureSession.findByPk(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Lecture session not found' });
        }

        // Delete session
        await session.destroy();

        res.status(200).json({ message: 'Lecture session deleted successfully' });
    } catch (error) {
        console.error('Error deleting lecture session:', error);
        res.status(500).json({ message: 'Error deleting lecture session', error: error.message });
    }
});

module.exports = router; 