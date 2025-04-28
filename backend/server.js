const express = require('express');
const mongoose = require('mongoose'); // first step to interact with your MongoDB database
const swaggerUi = require('swagger-ui-express'); //serve  Swagger docs with a nice user interface
const specs = require('./swagger'); // Swagger spec file
require('dotenv').config(); // Load .env variables
const initializeDatabase = require('./DB/initializeDatabase.js');
const authRoutes = require('./routes/authRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const userRoutes = require('./routes/userRoutes');
const redisRoutes = require('./routes/redisRoutes');
const courceRoutes = require('./routes/SQL/courceRoutes.js');
const studentsRoutes = require('./routes/SQL/studentRoutes.js');
const lectureSessionRoutes = require('./routes/SQL/lectureSessionRoutes.js');
const studentstoSessionsRoutes = require('./routes/SQL/StudentstoSessionsRoutes.js');
const queryRoutes = require('./routes/SQL/queryRoutes.js');

const cors = require('cors'); //middleware to allow cross-origin requests
 //browsers block web pages from making requests to a different domain or port than the one that served the original page.


// const session = require('express-session');


// const path = require('path');

// const redisClient = require('./redis.js'); // Fix the path to the Redis client

const setupPassport = require('./google/passport-config.js');


const app = express();

const passport = setupPassport(app); //configure passport for authentication

// Middleware
app.use(express.json());

app.use(cors());

// Basic route to test the API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lectures API' });
});

// Health check route
app.get('/_/health_check', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// MongoDB health check
app.get('/_/health_check_mongo', async (req, res) => {
  try {
    // Check MongoDB connection state
    const mongoState = mongoose.connection.readyState;

    if (mongoState === 1) {
      res.status(200).json({ status: 'OK', mongo: 'connected' });
    } else {
      res.status(500).json({ status: 'FAIL', mongo: 'disconnected' });
    }
  } catch (error) {
    res.status(500).json({ status: 'FAIL', mongo: 'error', error: error.message });
  }
});

// Routes
app.use('/lectures', lectureRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/_/redis', redisRoutes);
app.use('/api/lecture-sessions', lectureSessionRoutes);
app.use('/api/courses', courceRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/student-sessions', studentstoSessionsRoutes);
app.use('/api/queries', queryRoutes);

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // ✅ Required
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
    res.send(`Hello ${req.user.displayName}`);
  }
);

// Logout Route
app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// Start server after database initialization
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lecturesDB';

if (!URI) {
  console.error("MONGO_URI is undefined!");
  process.exit(1);
}

// Initialize MongoDB database
initializeDatabase(URI, "lecturesDB", 'lectures')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`MongoDB connected at ${URI}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

