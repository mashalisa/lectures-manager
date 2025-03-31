const express = require('express');
const mongoose = require('mongoose');
<<<<<<< HEAD
require('dotenv').config();
=======
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
require('dotenv').config();
const initializeDatabase = require('./initializeDatabase.js');
const Lecture = require('./models/lecture.js');
>>>>>>> 501587e (versio 1.0.0 with docker)

const app = express();

// Middleware
app.use(express.json());

<<<<<<< HEAD
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
=======
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Lecture:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the lecture (not required in POST request)
 *         title:
 *           type: string
 *           description: Title of the lecture
 *         description:
 *           type: string
 *           description: Description of the lecture
 *         category:
 *           type: string
 *           enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *           description: Category of the lecture
 *         date:
 *           type: string
 *           format: date-time
 *           description: Creation date of the lecture (auto-generated if not provided)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message for the API
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /lectures:
 *   get:
 *     summary: Get all lectures with pagination and filtering
 *     description: Retrieve a list of lectures with optional pagination and category filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *         description: Filter lectures by category
 *     responses:
 *       200:
 *         description: List of lectures with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lectures:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lecture'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *   post:
 *     summary: Create a new lecture
 *     description: Create a new lecture in the database (ID will be auto-generated)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the lecture
 *               description:
 *                 type: string
 *                 description: Description of the lecture
 *               category:
 *                 type: string
 *                 enum: [Science, Technology, Arts, Business, Education, Health, Social Sciences, Engineering, Humanities, Other]
 *                 description: Category of the lecture
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Creation date (optional, defaults to current date)
 *     responses:
 *       201:
 *         description: Lecture created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /lectures/{id}:
 *   get:
 *     summary: Get a lecture by ID
 *     description: Retrieve a specific lecture by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: Lecture not found
 *   put:
 *     summary: Update a lecture
 *     description: Update an existing lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lecture'
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: Lecture not found
 *       400:
 *         description: Invalid input data
 *   delete:
 *     summary: Delete a lecture
 *     description: Delete a lecture by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
 *       404:
 *         description: Lecture not found
 */
// Start server after database initialization
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI
if (!URI) {
  console.error(" MONGO_URI is undefined!");
  process.exit(1);
}
initializeDatabase(URI, "lecturesDB", 'lectures')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
>>>>>>> 501587e (versio 1.0.0 with docker)
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
<<<<<<< HEAD
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
=======
  }); 


>>>>>>> 501587e (versio 1.0.0 with docker)

// Basic route to test the API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lectures API' });
});

<<<<<<< HEAD
=======
// Basic route to test the API
app.get('/_/health_check', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Debug route to check all lectures
app.get('/debug/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.find({});
    res.json({
      count: lectures.length,
      lectures: lectures
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Swagger CRUD annotations

/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: CRUD operations for managing lectures
 */

/**
 * @swagger
 * /lectures:
 *   get:
 *     tags: [Lectures]
 *     summary: Get all lectures
 *     responses:
 *       200:
 *         description: A list of all lectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */

>>>>>>> 501587e (versio 1.0.0 with docker)
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

<<<<<<< HEAD
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
=======
// Get all lectures with filtering and pagination
app.get('/lectures', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    console.log('Pagination params:', { page, limit, category });

    // Build query
    const query = {};
>>>>>>> 501587e (versio 1.0.0 with docker)
    if (category) {
      query.category = category;
    }

<<<<<<< HEAD
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
=======
    // Get total count for pagination
    const total = await Lecture.countDocuments(query);
    console.log('Total documents:', total);

    // Get lectures with pagination
    const lectures = await Lecture.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log('Retrieved lectures count:', lectures.length);
>>>>>>> 501587e (versio 1.0.0 with docker)

    res.json({
      lectures,
      pagination: {
<<<<<<< HEAD
        currentPage: parseInt(page),
        totalPages,
        totalLectures,
        lecturesPerPage: parseInt(limit)
      },
      categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
=======
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Error fetching lectures' });
>>>>>>> 501587e (versio 1.0.0 with docker)
  }
});

// Get a single lecture by ID
app.get('/lectures/:id', async (req, res) => {
  try {
<<<<<<< HEAD
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
=======
    // Find the lecture by ID
    const lecture = await Lecture.findById(req.params.id);

    // If no lecture is found, return 404
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    // Return the found lecture
    res.status(200).json(lecture);
  } catch (err) {
    // If there's an error, return a 500 error
    res.status(500).json({ error: err.message });
  }
});

// Update a lecture
app.put('/lectures/:id', async (req, res) => {
  try {
    // Find lecture by string ID
    const lecture = await Lecture.findOne({ _id: req.params.id });
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Update only the fields that are provided in the request body
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key in lecture) {
        lecture[key] = req.body[key];
      }
    });

    const updatedLecture = await lecture.save();
    res.json(updatedLecture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a lecture
app.delete('/lectures/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findOne({ _id: req.params.id });
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    await lecture.deleteOne();
    res.json({ message: 'Lecture deleted successfully' });
>>>>>>> 501587e (versio 1.0.0 with docker)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
=======
>>>>>>> 501587e (versio 1.0.0 with docker)
