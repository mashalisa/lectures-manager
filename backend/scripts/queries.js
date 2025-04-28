const { LectureSession, Lecture, Student, sequelize } = require('../configSQL/database');

const queries = {
    // Get session statistics including student count
    getSessionStats: async () => {
        try {
            const sessionStats = await LectureSession.findAll({
                attributes: [
                    'id',
                    'session_time',
                    'capacity',
                    [sequelize.fn('COUNT', sequelize.col('Students.id')), 'student_count']
                ],
                include: [
                    {
                        model: Lecture,
                        attributes: ['lecture_name'],
                        required: true
                    },
                    {
                        model: Student,
                        attributes: [],
                        required: false,
                        through: { attributes: [] }
                    }
                ],
                group: [
                    'LectureSession.id',
                    'LectureSession.session_time',
                    'LectureSession.capacity',
                    'Lecture.lecture_name',
                    'Lecture.id'
                ]
            });

            return sessionStats.map(session => ({
                id: session.id,
                session_time: session.session_time,
                capacity: session.capacity,
                lecture_name: session.Lecture.lecture_name,
                student_count: parseInt(session.dataValues.student_count),
                available_spots: session.capacity - parseInt(session.dataValues.student_count)
            }));
        } catch (error) {
            throw new Error(`Error in getSessionStats: ${error.message}`);
        }
    },

    // Get full sessions
    getFullSessions: async () => {
        try {
            const fullSessions = await LectureSession.findAll({
                attributes: [
                    ['id', 'session_id'],
                    [sequelize.col('Lecture.lecture_name'), 'lecture_name'],
                    'session_time',
                    'capacity',
                    [sequelize.fn('COUNT', sequelize.col('Students.id')), 'student_count']
                ],
                include: [
                    {
                        model: Lecture,
                        attributes: []
                    },
                    {
                        model: Student,
                        through: { attributes: [] },
                        attributes: []
                    }
                ],
                group: [
                    'LectureSession.id',
                    'Lecture.id'
                ],
                having: sequelize.literal('COUNT("Students"."id") = "LectureSession"."capacity"')
            });

            return fullSessions.map(session => ({
                session_id: session.session_id,
                lecture_name: session.lecture_name,
                session_time: session.session_time,
                capacity: session.capacity,
                student_count: parseInt(session.dataValues.student_count)
            }));
        } catch (error) {
            throw new Error(`Error in getFullSessions: ${error.message}`);
        }
    },

    // Get student statistics
    getStudentStats: async () => {
        try {
            const students = await Student.findAll({
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    [sequelize.fn('COUNT', sequelize.col('LectureSessions.id')), 'total_sessions']
                ],
                include: [{
                    model: LectureSession,
                    attributes: ['id', 'session_time'],
                    through: { attributes: [] },
                    include: [{
                        model: Lecture,
                        attributes: ['lecture_name', 'category']
                    }]
                }],
                group: [
                    'Student.id',
                    'Student.first_name',
                    'Student.last_name',
                    'Student.email',
                    'LectureSessions.id',
                    'LectureSessions.session_time',
                    'LectureSessions.Lecture.id',
                    'LectureSessions.Lecture.lecture_name',
                    'LectureSessions.Lecture.category'
                ]
            });

            return students.map(student => ({
                student_id: student.id,
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                total_sessions: student.LectureSessions.length,
                sessions: student.LectureSessions.map(session => ({
                    session_id: session.id,
                    lecture_name: session.Lecture.lecture_name,
                    session_time: session.session_time,
                    category: session.Lecture.category
                }))
            }));
        } catch (error) {
            throw new Error(`Error in getStudentStats: ${error.message}`);
        }
    }
};

module.exports = queries;