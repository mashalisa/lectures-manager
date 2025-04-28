const express = require('express');
const router = express.Router();
const { Student, LectureSession, StudentLectureSession, Lecture } = require('../../configSQL/database');
const { auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentSession:
 *       type: object
 *       required:
 *         - student_id
 *         - session_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the registration
 *         student_id:
 *           type: integer
 *           description: The ID of the student
 *         session_id:
 *           type: integer
 *           description: The ID of the lecture session
 */

/**
 * @swagger
 * /api/student-sessions/student/{studentId}:
 *   get:
 *     summary: Get all sessions for a student
 *     tags: [Student Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: List of sessions the student is registered for
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   session_id:
 *                     type: integer
 *                   session_time:
 *                     type: string
 *                     format: date-time
 *                   lecture_name:
 *                     type: string
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get all sessions for the student with lecture details
        const student_with_sessions = await Student.findByPk(studentId, {
            include: [{
                model: LectureSession,
                include: [{
                    model: Lecture,
                    attributes: ['lecture_name']
                }]
            }]
        });

        const formattedSessions = student_with_sessions.LectureSessions.map(session => ({
            session_id: session.id,
            session_time: session.session_time,
            capacity: session.capacity,
            lecture_name: session.Lecture.lecture_name
        }));

        res.status(200).json(formattedSessions);
    } catch (error) {
        console.error('Error fetching student sessions:', error);
        res.status(500).json({ message: 'Error fetching student sessions', error: error.message });
    }
});

/**
 * @swagger
 * /api/student-sessions/session/{sessionId}:
 *   get:
 *     summary: Get all students registered for a session
 *     tags: [Student Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The session ID
 *     responses:
 *       200:
 *         description: List of students registered for the session
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/session/:sessionId', auth, async (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        // Check if session exists and get all registered students
        const session = await LectureSession.findByPk(sessionId, {
            include: [{
                model: Student,
                through: { attributes: [] } // Exclude junction table attributes
            }]
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const students = session.Students.map(student => ({
            student_id: student.id,
            first_name: student.first_name,
            last_name: student.last_name
        }));

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching session students:', error);
        res.status(500).json({ message: 'Error fetching session students', error: error.message });
    }
});

/**
 * @swagger
 * /api/student-sessions/register:
 *   post:
 *     summary: Register a student for a session
 *     tags: [Student Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - session_id
 *             properties:
 *               student_id:
 *                 type: integer
 *               session_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student successfully registered for session
 *       400:
 *         description: Session is full or student already registered
 *       404:
 *         description: Student or session not found
 *       500:
 *         description: Server error
 */
router.post('/register', auth, async (req, res) => {
    try {
        const { student_id, session_id } = req.body;

        // Validate input
        if (!student_id || !session_id) {
            return res.status(400).json({ message: 'Both student_id and session_id are required' });
        }

        // Check if student exists
        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if session exists and get capacity
        const session = await LectureSession.findByPk(session_id, {
            include: [{
                model: Student
            }]
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Check if student is already registered
        const isAlreadyRegistered = session.Students.some(s => s.id === student_id);
        if (isAlreadyRegistered) {
            return res.status(400).json({ message: 'Student already registered for this session' });
        }

        // Check if session is full
        if (session.Students.length >= session.capacity) {
            return res.status(400).json({ message: 'Session is full' });
        }

        // Create registration
        await StudentLectureSession.create({
            student_id,
            session_id
        });

        res.status(201).json({ message: 'Student successfully registered for session' });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: 'Error registering student', error: error.message });
    }
});

/**
 * @swagger
 * /api/student-sessions/unregister:
 *   delete:
 *     summary: Unregister a student from a session
 *     tags: [Student Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - session_id
 *             properties:
 *               student_id:
 *                 type: integer
 *               session_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student successfully unregistered from session
 *       404:
 *         description: Registration not found
 *       500:
 *         description: Server error
 */
router.delete('/unregister', auth, async (req, res) => {
    try {
        const { student_id, session_id } = req.body;

        // Validate input
        if (!student_id || !session_id) {
            return res.status(400).json({ message: 'Both student_id and session_id are required' });
        }

        // Find and delete registration
        const deleted = await StudentLectureSession.destroy({
            where: {
                student_id,
                session_id
            }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.status(200).json({ message: 'Student successfully unregistered from session' });
    } catch (error) {
        console.error('Error unregistering student:', error);
        res.status(500).json({ message: 'Error unregistering student', error: error.message });
    }
});

module.exports = router;