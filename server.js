const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Function to initialize database and collection
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check if database exists
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === 'lecturesDB');

    if (!dbExists) {
      console.log('Creating lecturesDB database...');
      // Create database by inserting a document
      await mongoose.connection.db.collection('lectures').insertOne({
        _id: 'initialization',
        created_at: new Date()
      });
      console.log('lecturesDB database created successfully');
    }

    // Check if lectures collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === 'lectures');

    if (!collectionExists) {
      console.log('Creating lectures collection...');
      // Create collection by inserting a document
      await mongoose.connection.db.collection('lectures').insertOne({
        _id: 'initialization',
        created_at: new Date()
      });
      console.log('lectures collection created successfully');
    }

    // Remove initialization documents
    await mongoose.connection.db.collection('lectures').deleteOne({ _id: 'initialization' });

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Initialize database and collection
initializeDatabase()
  .then(() => {
    console.log('Database and collection initialization completed');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Create Lectures Schema
const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Science', 'Technology', 'Arts', 'Business', 'Education', 'Health', 'Social Sciences', 'Engineering', 'Humanities', 'Other']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create Lectures Model
const Lecture = mongoose.model('Lecture', lectureSchema);

// Basic route to test the API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lectures API' });
});

// Create a new lecture
app.post('/lectures', async (req, res) => {
  try {
    const lecture = new Lecture(req.body);
    await lecture.save();
    res.status(201).json(lecture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all lectures with filtering
app.get('/lectures', async (req, res) => {
  try {
    const {
      title,
      id,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Filter by title (case-insensitive partial match)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Filter by ID
    if (id) {
      query._id = id;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalLectures = await Lecture.countDocuments(query);
    const totalPages = Math.ceil(totalLectures / parseInt(limit));

    // Execute query with pagination
    const lectures = await Lecture.find(query)
      .sort({ date: -1 }) // Sort by date in descending order
      .skip(skip)
      .limit(parseInt(limit));

    // Get category distribution
    const categoryDistribution = await Lecture.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      lectures,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalLectures,
        lecturesPerPage: parseInt(limit)
      },
      categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single lecture by ID
app.get('/lectures/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 