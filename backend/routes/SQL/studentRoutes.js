const express = require('express');
const router = express.Router();
const { Student } = require('../../configSQL/database');
const { auth } = require('../../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the student
 *         first_name:
 *           type: string
 *           description: The student's first name
 *         last_name:
 *           type: string
 *           description: The student's last name
 *         email:
 *           type: string
 *           description: The student's email address (must be unique)
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Returns all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
    try {
        const students = await Student.findAll();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by id
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student id
 *     responses:
 *       200:
 *         description: The student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
});

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: The created student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Missing required fields or email already exists
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        
        // Validate required fields
        if (!first_name || !last_name || !email) {
            return res.status(400).json({ 
                message: 'All fields are required: first_name, last_name, email' 
            });
        }

        // Check if email already exists
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).json({ 
                message: 'A student with this email already exists' 
            });
        }

        const newStudent = await Student.create({
            first_name,
            last_name,
            email
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
});

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: The updated student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        const studentId = req.params.id;

        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // If email is being updated, check if it's already in use by another student
        if (email && email !== student.email) {
            const existingStudent = await Student.findOne({ where: { email } });
            if (existingStudent) {
                return res.status(400).json({ 
                    message: 'A student with this email already exists' 
                });
            }
        }

        // Update student
        const updatedStudent = await student.update({
            first_name: first_name || student.first_name,
            last_name: last_name || student.last_name,
            email: email || student.email
        });

        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
});

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The student id
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const studentId = req.params.id;

        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete student
        await student.destroy();

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
});

module.exports = router; 