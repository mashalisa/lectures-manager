const { DataTypes } = require('sequelize');
const sequelize = require('../../../configSQL/sequelize');

// Create LectureSession model
const LectureSession = sequelize.define('LectureSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lecture_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lectures',
        key: 'id'
      }
    },
    session_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'lecture_sessions'
  });

// Set the schema
LectureSession.schema('coursesManager');

module.exports = LectureSession;