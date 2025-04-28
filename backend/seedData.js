const mongoose = require('mongoose');
require('dotenv').config();

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

// Function to seed the database
async function seedDatabase() {
    try {
        // Connect to MongoDB using the correct environment variable
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        await Lecture.deleteMany({});
        console.log('Cleared existing data');

        // Generate 9000 lecture documents
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
}

// Run the seeding function
seedDatabase(); 