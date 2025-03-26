const mongoose = require('mongoose');
require('dotenv').config();

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
}

// Run the seeding function
seedDatabase(); 