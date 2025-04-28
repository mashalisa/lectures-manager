const { DataTypes } = require('sequelize');
const sequelize = require('../../../configSQL/sequelize');

// Create Lecture model
const Lecture = sequelize.define('Lecture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lecture_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  tableName: 'lectures'
});

// Set the schema
Lecture.schema('coursesManager');

module.exports = Lecture;