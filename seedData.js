const mongoose = require('mongoose');
require('dotenv').config();

<<<<<<< HEAD
// Create Lectures Schema (same as in server.js)
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

// Sample data arrays for generating random lectures
const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'History', 'Literature', 'Economics', 'Philosophy', 'Psychology'
];

const topics = [
  'Introduction', 'Advanced Concepts', 'Fundamentals', 'Applications',
  'Theory', 'Practice', 'Case Studies', 'Research Methods', 'Analysis',
  'Implementation'
];

const adjectives = [
  'Modern', 'Classical', 'Advanced', 'Basic', 'Theoretical',
  'Practical', 'Experimental', 'Applied', 'Digital', 'Traditional'
];

const categories = [
  'Science', 'Technology', 'Arts', 'Business', 'Education',
  'Health', 'Social Sciences', 'Engineering', 'Humanities', 'Other'
];

// Subject to Category mapping
const subjectCategoryMap = {
  'Mathematics': ['Science', 'Technology', 'Engineering'],
  'Physics': ['Science', 'Technology', 'Engineering'],
  'Chemistry': ['Science', 'Technology', 'Health'],
  'Biology': ['Science', 'Health'],
  'Computer Science': ['Technology', 'Engineering'],
  'History': ['Humanities', 'Social Sciences'],
  'Literature': ['Arts', 'Humanities'],
  'Economics': ['Business', 'Social Sciences'],
  'Philosophy': ['Humanities', 'Social Sciences'],
  'Psychology': ['Health', 'Social Sciences']
};

// Function to generate random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to get random category based on subject
function getRandomCategory(subject) {
  const possibleCategories = subjectCategoryMap[subject] || categories;
  return possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
}

// Function to generate random lecture data
function generateLecture() {
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const category = getRandomCategory(subject);
  
  return {
    title: `${adjective} ${subject}: ${topic}`,
    description: `This lecture covers ${topic.toLowerCase()} in ${subject.toLowerCase()}, focusing on ${adjective.toLowerCase()} approaches and methodologies.`,
    category: category,
    date: randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31))
  };
}

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing data
    await Lecture.deleteMany({});
    console.log('Cleared existing lectures');

    // Generate and insert lectures in batches
    const batchSize = 100;
    const totalLectures = 1000;
    
    for (let i = 0; i < totalLectures; i += batchSize) {
      const lectures = [];
      const currentBatchSize = Math.min(batchSize, totalLectures - i);
      
      for (let j = 0; j < currentBatchSize; j++) {
        lectures.push(generateLecture());
      }
      
      await Lecture.insertMany(lectures);
      console.log(`Inserted ${i + currentBatchSize} lectures out of ${totalLectures}`);
    }

    // Log category distribution
    const categoryDistribution = await Lecture.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\nCategory Distribution:');
    categoryDistribution.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} lectures`);
    });

    console.log('\nDatabase seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
=======
// Import the Lecture model from models/lecture.js
const Lecture = require('./models/lecture');

// Sample data for generating random lectures
const categories = ['Science', 'Technology', 'Arts', 'Business', 'Education', 'Health', 'Social Sciences', 'Engineering', 'Humanities', 'Other'];
const titles = [
    'Introduction to', 'Advanced Concepts in', 'Fundamentals of', 'Modern Approaches to',
    'The Future of', 'Understanding', 'Exploring', 'Mastering', 'Principles of', 'Applications in'
];
const subjects = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development',
    'Cloud Computing', 'Cybersecurity', 'Digital Marketing', 'Project Management',
    'Business Analytics', 'Software Engineering', 'Network Architecture', 'Database Design',
    'Mobile Development', 'UI/UX Design', 'DevOps Practices', 'Blockchain Technology',
    'Internet of Things', 'Big Data Analytics', 'Cloud Architecture', 'Agile Methodologies'
];

// Function to generate random date within a range
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate random description
function generateDescription() {
    const sentences = [
        'This comprehensive lecture covers essential concepts and practical applications.',
        'Learn about the latest trends and best practices in this field.',
        'Explore real-world examples and case studies to enhance your understanding.',
        'Master the fundamentals and advanced techniques through hands-on exercises.',
        'Discover innovative approaches and cutting-edge solutions.',
        'Gain practical insights from industry experts and experienced professionals.',
        'Understand the theoretical foundations and their practical implementations.',
        'Develop critical thinking skills through interactive learning experiences.',
        'Stay updated with current industry standards and emerging technologies.',
        'Build a strong foundation for your professional development.'
    ];
    return sentences[Math.floor(Math.random() * sentences.length)];
}

// Function to generate a single lecture document
function generateLecture() {
    const title = `${titles[Math.floor(Math.random() * titles.length)]} ${subjects[Math.floor(Math.random() * subjects.length)]}`;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
    
    return {
        title,
        description: generateDescription(),
        category,
        date
    };
}

// Function to generate bulk data
async function seedDatabase() {
    try {
        // Connect to MongoDB using the correct environment variable
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        await Lecture.deleteMany({});
        console.log('Cleared existing data');

        // Generate 1000 lecture documents
        const lectures = Array.from({ length: 9000 }, generateLecture);

        // Insert documents in bulk
        const result = await Lecture.insertMany(lectures);
        console.log(`Successfully inserted ${result.length} lectures`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
>>>>>>> 501587e (versio 1.0.0 with docker)
}

// Run the seeding function
seedDatabase(); 