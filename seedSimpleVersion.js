const mongoose = require('mongoose');
require('dotenv').config();

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

const categories = [
  'Science', 'Technology', 'Arts', 'Business', 'Education', 
  'Health', 'Social Sciences', 'Engineering', 'Humanities', 'Other'
];

const titles = [
  'Introduction to', 'Advanced Concepts in', 'Fundamentals of', 
  'Modern Approaches to', 'Principles of', 'The Science of',
  'Understanding', 'Exploring', 'Mastering', 'Deep Dive into'
];

const subjects = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 
  'Web Development', 'Mobile Development', 'Cloud Computing',
  'Cybersecurity', 'Blockchain', 'Internet of Things', 'Robotics',
  'Digital Marketing', 'Business Analytics', 'Project Management',
  'Human Psychology', 'Environmental Science', 'Quantum Computing',
  'Augmented Reality', 'Virtual Reality', 'Game Development',
  'Software Engineering'
];

const descriptions = [
  'A comprehensive guide to understanding the core concepts and principles.',
  'Learn the latest techniques and best practices in this field.',
  'Explore cutting-edge developments and future trends.',
  'Master the fundamentals and advanced concepts.',
  'Practical applications and real-world examples.',
  'Theoretical foundations and practical implementations.',
  'Industry standards and emerging technologies.',
  'Best practices and common pitfalls to avoid.',
  'Case studies and hands-on projects.',
  'Future trends and career opportunities.'
];

async function generateLectures(count) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing lectures
    await Lecture.deleteMany({});
    console.log('Cleared existing lectures');

    const lectures = [];
    const startDate = new Date('2024-01-01');

    for (let i = 0; i < count; i++) {
      const titleIndex = Math.floor(Math.random() * titles.length);
      const subjectIndex = Math.floor(Math.random() * subjects.length);
      const descriptionIndex = Math.floor(Math.random() * descriptions.length);
      const categoryIndex = Math.floor(Math.random() * categories.length);
      
      // Generate a random date between startDate and now
      const randomDate = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));

      lectures.push({
        title: `${titles[titleIndex]} ${subjects[subjectIndex]}`,
        description: descriptions[descriptionIndex],
        category: categories[categoryIndex],
        date: randomDate
      });

      // Insert in batches of 100 for better performance
      if (lectures.length === 100) {
        await Lecture.insertMany(lectures);
        console.log(`Inserted ${i + 1} lectures`);
        lectures.length = 0;
      }
    }

    // Insert any remaining lectures
    if (lectures.length > 0) {
      await Lecture.insertMany(lectures);
      console.log(`Inserted final batch of ${lectures.length} lectures`);
    }

    console.log(`Successfully generated ${count} lectures`);
    process.exit(0);
  } catch (error) {
    console.error('Error generating lectures:', error);
    process.exit(1);
  }
}

// Generate 10,000 lectures
generateLectures(10000); 