const mongoose = require('mongoose');


// Function to initialize database and collection
async function initializeDatabase(URI_env, databaseName, collectionName) {
  try {
    // Connect to MongoDB
    const URI = URI_env
    console.log("MONGO_URI: ", URI)
    await mongoose.connect(URI);
    console.log('Connected to MongoDB successfully');

    // Check if database exists
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === databaseName);

    if (!dbExists) {
      console.log('Creating lecturesDB database...');
      // Create database by inserting a document
      await mongoose.connection.db.collection(collectionName).insertOne({
        _id: 'initialization',
        created_at: new Date()
      });
      console.log(databaseName, ' database created successfully');
    }

    // Check if lectures collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collectionName);

    if (!collectionExists) {
      console.log('Creating lectures collection...');
      // Create collection by inserting a document
      await mongoose.connection.db.collection(collectionName).insertOne({
        _id: 'initialization',
        created_at: new Date()
      });
      console.log(collectionName, ' collection created successfully');
    }

    // Remove initialization documents
    await mongoose.connection.db.collection(collectionName).deleteOne({ _id: 'initialization' });

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = initializeDatabase;