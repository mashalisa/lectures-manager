const { sequelize } = require('./sequelize');
const { StudentLectureSession, LectureSession } = require('./database');

async function registerStudentToSession(studentId, sessionId) {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    // 1. Lock the lecture session row to check capacity
    const session = await LectureSession.findOne({
      where: { id: sessionId },
      lock: transaction.LOCK.UPDATE, // Lock the row FOR UPDATE
      transaction // Pass the transaction object
    });

    if (!session) {
      throw new Error("Lecture session not found.");
    }

    // Step 2: Count current registrations
    const currentCount = await StudentLectureSession.count({ // Count the number of registrations for the session
      where: { session_id: sessionId },
      transaction // Pass the transaction object
    });

    if (currentCount >= session.capacity) {
      throw new Error("Session is full.");
    }

    // 3. Check if student is already registered
    const existingRegistration = await StudentLectureSession.findOne({
      where: {
        student_id: studentId,
        session_id: sessionId
      },
      transaction
    });

    if (existingRegistration) {
      throw new Error('Student is already registered for this session');
    }

    // 4. Register the student
    await StudentLectureSession.create({
      student_id: studentId, // Register the student
      session_id: sessionId // Pass the transaction object
    }, { transaction }); // Pass the transaction object

    // 5. Commit the transaction
    await transaction.commit();
    return { message: 'Registration successful' };

  } catch (error) {
    // 6. Rollback the transaction on error
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  registerStudentToSession
};
