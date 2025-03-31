const axios = require('axios');
const assert = require('assert');
const { MongoClient } = require('mongodb');

// Use environment variables for Docker compatibility
const LECTURES_API = process.env.API_URL || 'http://localhost:3000/lectures';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'lecturesDB';
const COLLECTION = process.env.COLLECTION || 'lectures';

async function measureFetchTime() {
    console.log("\nPerformance Test Results:");
    console.log("------------------------");

    // Test 1: Fetch without index
    console.log("\n1. Testing fetch WITHOUT index:");
    const startNoIndex = Date.now();
    const responseNoIndex = await axios.get(LECTURES_API);
    const timeNoIndex = Date.now() - startNoIndex;
    console.log(`- Time taken: ${timeNoIndex} ms`);
    console.log(`- Documents retrieved: ${responseNoIndex.data.lectures.length}`);

    // Connect to MongoDB and create index
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Create index on category field
    console.log("\n2. Creating index on category field...");
    await collection.createIndex({ category: 1 });
    console.log("- Index created successfully");

    // Test 2: Fetch with index
    console.log("\n3. Testing fetch WITH index:");
    const startWithIndex = Date.now();
    const responseWithIndex = await axios.get(LECTURES_API);
    const timeWithIndex = Date.now() - startWithIndex;
    console.log(`- Time taken: ${timeWithIndex} ms`);
    console.log(`- Documents retrieved: ${responseWithIndex.data.lectures.length}`);

    // Performance comparison
    console.log("\n4. Performance Comparison:");
    const improvement = timeNoIndex - timeWithIndex;
    console.log(`- Performance improvement: ${improvement} ms`);
    console.log(`- Improvement percentage: ${((improvement / timeNoIndex) * 100).toFixed(2)}%`);

    // Assertions
    try {
        // Assert that indexed query is faster
        assert(timeWithIndex < timeNoIndex, 
            `Indexed query (${timeWithIndex}ms) should be faster than non-indexed query (${timeNoIndex}ms)`);
        
        // Assert that we got the same number of documents
        assert(responseNoIndex.data.lectures.length === responseWithIndex.data.lectures.length,
            "Both queries should return the same number of documents");
        
        console.log("\n✅ All assertions passed!");
    } catch (error) {
        console.error("\n❌ Test failed:", error.message);
    }

    // Clean up
    await client.close();
    console.log("\nTest completed. MongoDB connection closed.");
}

// Run the test
measureFetchTime().catch(error => {
    console.error("Test failed with error:", error);
    process.exit(1);
}); 