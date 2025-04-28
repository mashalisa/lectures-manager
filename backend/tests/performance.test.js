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
    console.log(`Testing API endpoint: ${LECTURES_API}`);

    let timeNoIndex = 0;
    let timeWithIndex = 0;
    let responseNoIndex = null;
    let responseWithIndex = null;

    try {
        // Test 1: Fetch without index
        console.log("\n1. Testing fetch WITHOUT index:");
        const startNoIndex = Date.now();
        try {
            responseNoIndex = await axios.get(`${LECTURES_API}?page=1&limit=10`);
            timeNoIndex = Date.now() - startNoIndex;
            console.log(`- Time taken: ${timeNoIndex} ms`);
            console.log(`- Documents retrieved: ${responseNoIndex.data.lectures.length}`);
            console.log(`- Total documents: ${responseNoIndex.data.pagination.total}`);
        } catch (error) {
            console.error("Error during first API call:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            throw error;
        }

        // Connect to MongoDB and drop existing indexes
        console.log("\n2. Connecting to MongoDB...");
        const client = new MongoClient(MONGO_URI);
        try {
            await client.connect();
            console.log("- Connected to MongoDB successfully");
        } catch (error) {
            console.error("MongoDB connection error:", error.message);
            throw error;
        }

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);

        // Drop existing indexes
        console.log("\n3. Dropping existing indexes...");
        try {
            await collection.dropIndexes();
            console.log("- Existing indexes dropped successfully");
        } catch (error) {
            console.error("Error dropping indexes:", error.message);
            throw error;
        }

        // Create new index on category field
        console.log("\n4. Creating index on category field...");
        try {
            await collection.createIndex({ category: 1 });
            console.log("- Index created successfully");
        } catch (error) {
            console.error("Error creating index:", error.message);
            throw error;
        }

        // Test 2: Fetch with index
        console.log("\n5. Testing fetch WITH index:");
        const startWithIndex = Date.now();
        try {
            responseWithIndex = await axios.get(`${LECTURES_API}?page=1&limit=10`);
            timeWithIndex = Date.now() - startWithIndex;
            console.log(`- Time taken: ${timeWithIndex} ms`);
            console.log(`- Documents retrieved: ${responseWithIndex.data.lectures.length}`);
            console.log(`- Total documents: ${responseWithIndex.data.pagination.total}`);

            // Performance comparison
            console.log("\n6. Performance Comparison:");
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
                
                // Assert that pagination info is present
                assert(responseNoIndex.data.pagination && responseWithIndex.data.pagination,
                    "Response should include pagination information");
                
                console.log("\n✅ All assertions passed!");
            } catch (error) {
                console.error("\n❌ Test failed:", error.message);
            }
        } catch (error) {
            console.error("Error during second API call:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            throw error;
        }

        // Clean up
        await client.close();
        console.log("\nTest completed. MongoDB connection closed.");
    } catch (error) {
        console.error("\n❌ Test failed with error:", error.message);
        process.exit(1);
    }
}

// Run the test
measureFetchTime().catch(error => {
    console.error("Test failed with error:", error.message);
    process.exit(1);
}); 