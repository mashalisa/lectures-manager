const sequelize = require('./sequelize')
require('dotenv').config();


const students = require('./models/SQL/students');


// Function to generate random first names
function generateFirstName() {
    const first_names = [
        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", 
        "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
        "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
        "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
        "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
        "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa",
        "Timothy", "Deborah", "Ronald", "Stephanie", "Jason", "Rebecca", "Ryan", "Sharon"
    ];
    return first_names[Math.floor(Math.random() * first_names.length)];
}

// Function to generate random last names
function generateLastName() {
    const last_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
        "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
        "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
        "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
        "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
        "Carter", "Roberts", "Turner", "Phillips", "Parker", "Evans", "Edwards", "Collins"
    ];
    return last_names[Math.floor(Math.random() * last_names.length)];
}

// Function to generate random email
function generateEmail(firstName, lastName) {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "student.edu"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@${randomDomain}`;
}

// Function to generate random email
function generateEmail(firstName, lastName) {
    const first_name = generateFirstName();
    const last_name = generateLastName();
    const email = generateEmail(first_name, last_name);
    
    return {
        first_name,
        last_name,
        email,
    };
}


// Function to generate a single student
function generateStudent() {
    const first_name = generateFirstName();
    const last_name = generateLastName();
    const email = generateEmail(first_name, last_name);
    
    return {
        first_name,
        last_name,
        email,
    };
}

// Function to seed the database
async function seedStudents() {
    try {
        // Connect to PostgreSQL using Sequelize
        await sequelize.authenticate();
        console.log('✅ Connection to PostgreSQL has been established successfully.');

        // Clear existing data
        await students.destroy({ where: {} }); // Using Sequelize's destroy instead of MongoDB's deleteMany
        console.log('Cleared existing data');

        // Generate 300 student records
        const studentRecords = Array.from({ length: 300 }, generateStudent);

        // Insert records using Sequelize
        await students.bulkCreate(studentRecords);
        console.log(`Successfully inserted 300 students`);

        // Close the connection
        await sequelize.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedStudents(); 