const axios = require('axios');
const assert = require('assert');
const { MongoClient } = require('mongodb');

const LECTURES_API = 'http://localhost:3000/lectures'; // Update with your API URL
const MONGO_URI = 'mongodb://localhost:27017'; // Update if needed
const DB_NAME = 'lecturesDB'; // Replace with your actual database name
const COLLECTION = 'lectures';

async function measureFetchTime() {
    console.log("Fetching lectures WITHOUT index...");
    const startNoIndex = Date.now();
    await axios.get(LECTURES_API);
    const timeNoIndex = Date.now() - startNoIndex;
    console.log(`Fetch time WITHOUT index: ${timeNoIndex} ms`);

    // Connect to MongoDB and create an index
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    console.log('Creating index on category...');
    await collection.createIndex({ category: 1 });

    console.log("Fetching lectures WITH index...");
    const startWithIndex = Date.now();
    await axios.get(LECTURES_API);
    const timeWithIndex = Date.now() - startWithIndex;
    console.log(`Fetch time WITH index: ${timeWithIndex} ms`);

    // **Assert: Check that indexed query is faster**
    try {
        assert(timeWithIndex < timeNoIndex, "Indexing did not improve performance");
        console.log(" Index improved performance!");
    } catch (error) {
        console.error(" Test failed: Indexing did not reduce fetch time");
    }

    // Clean up
    await client.close();
}

measureFetchTime().catch(console.error);
