const express = require('express');
const router = express.Router();
const queries = require('../../scripts/queries');
const { auth } = require('../../middleware/auth');

console.log('test')

/**
 * @swagger
 * /api/queries/session-stats:
 *   get:
 *     summary: Get session statistics including student count
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions with their statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   session_time:
 *                     type: string
 *                     format: date-time
 *                   capacity:
 *                     type: integer
 *                   lecture_name:
 *                     type: string
 *                   student_count:
 *                     type: integer
 *                   available_spots:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get('/session-stats', auth, async (req, res) => {
    try {
        const stats = await queries.getSessionStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in session-stats endpoint:', error);
        res.status(500).json({ message: 'Error fetching session statistics', error: error.message });
    }
});

/**
 * @swagger
 * /api/queries/full-sessions:
 *   get:
 *     summary: Get all lecture sessions that are at full capacity
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of full sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   session_id:
 *                     type: integer
 *                   lecture_name:
 *                     type: string
 *                   session_time:
 *                     type: string
 *                     format: date-time
 *                   capacity:
 *                     type: integer
 *                   student_count:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get('/full-sessions', auth, async (req, res) => {
    try {
        const fullSessions = await queries.getFullSessions();
        res.status(200).json(fullSessions);
    } catch (error) {
        console.error('Error in full-sessions endpoint:', error);
        res.status(500).json({ message: 'Error fetching full sessions', error: error.message });
    }
});

/**
 * @swagger
 * /api/queries/student-stats:
 *   get:
 *     summary: Get statistics about students and their lecture sessions
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students with their session statistics
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
 *                   email:
 *                     type: string
 *                   total_sessions:
 *                     type: integer
 *                   sessions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         session_id:
 *                           type: integer
 *                         lecture_name:
 *                           type: string
 *                         session_time:
 *                           type: string
 *                           format: date-time
 *                         category:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get('/student-stats', auth, async (req, res) => {
    try {
        const stats = await queries.getStudentStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error in student-stats endpoint:', error);
        res.status(500).json({ message: 'Error fetching student statistics', error: error.message });
    }
});

module.exports = router;