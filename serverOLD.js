const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
require('dotenv').config();


const app = express();

// Middleware
app.use(express.json());

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

// Function to initialize database and collection
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const URI = process.env.MONGO_URI
    console.log("MONGO_URI: ", URI)
    await mongoose.connect(URI);
    console.log('Connected to MongoDB successfully');

    // Get current database name
    const currentDb = mongoose.connection.db.databaseName;
    console.log('Connected to database:', currentDb);

    // Verify database connection and data
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections in current database:', collections.map(c => c.name));

    // Check lectures collection
    const lecturesCollection = collections.find(c => c.name === 'lectures');
    if (lecturesCollection) {
      const count = await Lecture.countDocuments();
      console.log('Total lectures in database:', count);
      
      // Sample a few documents
      const sampleDocs = await Lecture.find().limit(3);
      console.log('Sample documents:', JSON.stringify(sampleDocs, null, 2));
    } else {
      console.log('Lectures collection not found!');
    }

    // Try to list databases (this might fail without admin privileges)
    try {
      const dbs = await mongoose.connection.db.admin().listDatabases();
      console.log('Available databases:', dbs.databases.map(db => db.name));
    } catch (error) {
      console.log('Note: Unable to list all databases. This is normal if the user does not have admin privileges.');
      console.log('Current database:', currentDb);
    }

    // Check if lectures collection exists
    const collectionExists = collections.some(col => col.name === 'lectures');

    if (!collectionExists) {
      console.log('Creating lectures collection...');
      // Create collection by inserting a document
      try {
        await mongoose.connection.db.collection('lectures').insertOne({
          _id: 'initialization',
          created_at: new Date()
        });
        console.log('lectures collection created successfully');
      } catch (error) {
        if (error.code !== 11000) { // Ignore duplicate key errors
          throw error;
        }
      }
    }

    // Try to remove initialization documents if they exist
    try {
      await mongoose.connection.db.collection('lectures').deleteOne({ _id: 'initialization' });
    } catch (error) {
      // Ignore errors when trying to remove initialization document
    }

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
//  Add a compound index for "category" and "date"
lectureSchema.index({ category: 1, date: -1 });
// Create Lectures Model
const Lecture = mongoose.model('Lecture', lectureSchema);

// Export the Lecture model
module.exports = { Lecture };

// Basic route to test the API
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Lectures API' });
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

// Get all lectures with filtering and pagination
app.get('/lectures', async (req, res) => {
    try {
      // Get pagination parameters from query string
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      console.log('Pagination params:', { page, limit, skip });

      // Build filter object
      const filter = {};
      if (req.query.category) {
        filter.category = req.query.category;
      }
  
      // Get total count for pagination
      const total = await Lecture.countDocuments(filter);
      console.log('Total documents:', total);
      
      // Get paginated lectures
      const lectures = await Lecture.find(filter)
        .sort({ date: -1 }) // Sort by date in descending order
        .skip(skip)
        .limit(limit);

      console.log('Retrieved lectures count:', lectures.length);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.status(200).json({
        lectures,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      });
    } catch (err) {
      console.error('Error in GET /lectures:', err);
      res.status(500).json({ error: err.message });
    }
  });

// Get a single lecture by ID
app.get('/lectures/:id', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 