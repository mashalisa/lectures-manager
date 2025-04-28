// models/student.js
const { DataTypes } = require('sequelize'); //
const sequelize = require('../../../configSQL/sequelize');

// Create Student model
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'students'
});

// Set the schema
Student.schema('coursesManager');

module.exports = Student;
