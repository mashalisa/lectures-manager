const sequelize = require('./sequelize');
const Student = require('../DB/models/SQL/students');
const Lecture = require('../DB/models/SQL/lecture');
const LectureSession = require('../DB/models/SQL/lectureSession');
const StudentLectureSession = require('../DB/models/SQL/StudentLectureSession');

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate(); //test the connection to the database
    console.log('✅ Connection to PostgreSQL has been established successfully.');
    
    // Test a simple query
    const result = await sequelize.query('SELECT version();');
    console.log('📊 PostgreSQL version:', result[0][0].version);
    return true; //Returns true if successful, or false if there was an error.
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
}

// Create schema if not exists and set it as default
async function createSchema() {
  try {
    // First, list all available schemas to help debug
    const allSchemas = await sequelize.query(
      "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;"
    );
    console.log('📋 Available schemas:', allSchemas[0].map(s => s.schema_name));

    // Create schema if it doesn't exist
    await sequelize.query('CREATE SCHEMA IF NOT EXISTS "coursesManager";');
    console.log('✅ Schema coursesManager created or already exists');

    // Set the search path to the schema
    await sequelize.query('SET search_path TO "coursesManager";');
    console.log('✅ Search path set to coursesManager schema');

    // Verify the schema is accessible
    const verifySchema = await sequelize.query('SELECT current_schema();');
    console.log('✅ Current schema verified:', verifySchema[0][0].current_schema);

    return 'coursesManager';

  } catch (error) {
    console.error('❌ Error in createSchema:', error);
    throw error;
  }
}

// Insert sample data using models
async function insertSampleData() {
    try {
        // Add timestamp to make emails unique
        const timestamp = Date.now();

        // Create lectures
        const [lecture1, lecture2, lecture3] = await Promise.all([
            Lecture.create({
                lecture_name: 'Introduction to Node.js',
                description: 'Learn the basics of Node.js programming',
                category: 'Technology'
            }),
            Lecture.create({
                lecture_name: 'Advanced JavaScript',
                description: 'Deep dive into JavaScript concepts',
                category: 'Programming'
            }),
            Lecture.create({
                lecture_name: 'Database Design',
                description: 'Learn SQL and database modeling',
                category: 'Database'
            })
        ]);
        console.log('✅ Sample lectures inserted:', lecture1.id, lecture2.id, lecture3.id);

        // Create students with unique emails
        const [student1, student2, student3] = await Promise.all([
            Student.create({
                first_name: 'John',
                last_name: 'Doe',
                email: `john.doe.${timestamp}@example.com`
            }),
            Student.create({
                first_name: 'Jane',
                last_name: 'Smith',
                email: `jane.smith.${timestamp}@example.com`
            }),
            Student.create({
                first_name: 'Bob',
                last_name: 'Johnson',
                email: `bob.johnson.${timestamp}@example.com`
            })
        ]);
        console.log('✅ Sample students inserted:', student1.id, student2.id, student3.id);

        // Create lecture sessions
        const [session1, session2, session3] = await Promise.all([
            LectureSession.create({
                lecture_id: lecture1.id,
                session_time: new Date('2024-03-20T10:00:00Z'),
                capacity: 30
            }),
            LectureSession.create({
                lecture_id: lecture2.id,
                session_time: new Date('2024-03-21T14:00:00Z'),
                capacity: 25
            }),
            LectureSession.create({
                lecture_id: lecture3.id,
                session_time: new Date('2024-03-22T15:00:00Z'),
                capacity: 20
            })
        ]);
        console.log('✅ Sample lecture sessions inserted:', session1.id, session2.id, session3.id);

        // Create student-session relationships
        await Promise.all([
            // John Doe is registered for Node.js and JavaScript sessions
            StudentLectureSession.create({
                student_id: student1.id,
                session_id: session1.id
            }),
            StudentLectureSession.create({
                student_id: student1.id,
                session_id: session2.id
            }),
            // Jane Smith is registered for JavaScript and Database sessions
            StudentLectureSession.create({
                student_id: student2.id,
                session_id: session2.id
            }),
            StudentLectureSession.create({
                student_id: student2.id,
                session_id: session3.id
            }),
            // Bob Johnson is registered for all sessions
            StudentLectureSession.create({
                student_id: student3.id,
                session_id: session1.id
            }),
            StudentLectureSession.create({
                student_id: student3.id,
                session_id: session2.id
            }),
            StudentLectureSession.create({
                student_id: student3.id,
                session_id: session3.id
            })
        ]);
        console.log('✅ Sample student-session relationships created successfully');

        // Log the counts for verification
        const studentCount = await Student.count();
        const lectureCount = await Lecture.count();
        const sessionCount = await LectureSession.count();
        const registrationCount = await StudentLectureSession.count();

        console.log('📊 Database counts:', {
            students: studentCount,
            lectures: lectureCount,
            sessions: sessionCount,
            registrations: registrationCount
        });

        return {
            lectures: [lecture1, lecture2, lecture3],
            students: [student1, student2, student3],
            sessions: [session1, session2, session3]
        };
    } catch (error) {
        console.error('❌ Error inserting sample data:', error);
        throw error;
    }
}

// Initialize database with Sequelize sync
async function initDatabase(options = {}) {
  try {
    // First ensure schema exists and set it as default
    const schemaName = await createSchema();

    // Define schema for all models
    const models = [Student, Lecture, LectureSession, StudentLectureSession];
    models.forEach(model => {
      if (model.getTableName) {
        const tableName = model.getTableName();
        model.schema(schemaName);
        console.log(`✅ Set schema for model: ${tableName}`);
      }
    });

    // Sync all models
    await sequelize.sync({ 
      force: options.force || false, //f true, drops all existing tables and recreates them.
      alter: options.alter || false, //If true, Sequelize will try to update existing tables to match your models.
      schema: schemaName
    });
    console.log('✅ Database tables synchronized successfully.');

    // Insert sample data if requested
    if (options.insertSampleData) { //if true, inserts sample data into the database.
      await insertSampleData();
    }

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// If this file is run directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🔍 Testing database connection...');
      const connected = await testConnection();
      
      if (connected) {
        console.log('\n🔄 Initializing database...');
        await initDatabase({
          force: false,
          alter: false,
          insertSampleData: true
        });
        
        console.log('\n✨ Database setup completed!');
      }
    } catch (error) {
      console.error('❌ Error during database setup:', error);
      process.exit(1);
    } finally {
      await sequelize.close(); //Closes the database connection.
    }
  })();
}

module.exports = {
  sequelize,
  Student,
  Lecture,
  LectureSession,
  StudentLectureSession,
  testConnection,
  initDatabase
};