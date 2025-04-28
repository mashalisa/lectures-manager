const { DataTypes } = require('sequelize');
const sequelize = require('../../../configSQL/sequelize');
const Student = require('./students');
const LectureSession = require('./lectureSession');
const Lecture = require('./lecture');

// Create StudentLectureSession model (junction table)
const StudentLectureSession = sequelize.define('StudentLectureSession', {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'students',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'lecture_sessions',
        key: 'id'
      }
    }
  }, {
    tableName: 'student_lecture_sessions',
    timestamps: false // Don't add created_at and updated_at
  });
  
  // Set the schema
  StudentLectureSession.schema('coursesManager');
  
  // Define relationships
  Lecture.hasMany(LectureSession, { foreignKey: 'lecture_id' });
  LectureSession.belongsTo(Lecture, { foreignKey: 'lecture_id' });
  
  Student.belongsToMany(LectureSession, { 
    through: StudentLectureSession,
    foreignKey: 'student_id',
    otherKey: 'session_id'
  });
  
  LectureSession.belongsToMany(Student, { 
    through: StudentLectureSession,
    foreignKey: 'session_id',
    otherKey: 'student_id'
  });

module.exports = StudentLectureSession;