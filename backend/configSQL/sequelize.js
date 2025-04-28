const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'mydb',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
    schema: 'coursesManager'  // Set default schema
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    prependSearchPath: true  // Automatically prepend schema to search path
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connection to PostgreSQL has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

module.exports = sequelize; 