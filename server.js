const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
require('dotenv').config(); // Load .env variables
const initializeDatabase = require('./initializeDatabase.js');
const authRoutes = require('./routes/authRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

// Middleware
app.use(express.json());

// Basic route to test the API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lectures API' });
});

// Health check route
app.get('/_/health_check', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/lectures', lectureRoutes);
app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start server after database initialization
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;

if (!URI) {
  console.error("MONGO_URI is undefined!");
  process.exit(1);
}

initializeDatabase(URI, "lecturesDB", 'lectures')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

