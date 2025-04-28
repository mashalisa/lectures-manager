// Simple Redis Test
// This file tests if Redis is working with our application

const axios = require('axios'); //library is commonly used to make HTTP requests to external services
const assert = require('assert');
const redisClient = require('../redis/redis.js');

// Use environment variables for Docker compatibility
const LECTURES_API = process.env.API_URL || 'http://localhost:3000/lectures';

async function measureRedisPerformance() {
    console.log("\nRedis Performance Test Results:");
    console.log("------------------------");
    console.log(`Testing API endpoint: ${LECTURES_API}`);

    let timeWithoutCache = 0;
    let timeWithCache = 0;
    let responseWithoutCache = null;
    let responseWithCache = null;

    try {
        // Test 1: Fetch without cache
        console.log("\n1. Testing fetch WITHOUT Redis cache:");
        const startWithoutCache = Date.now();
        try {
            // Clear any existing cache for this query
            const cacheKey = `lectures:Engineering:page:1:limit:10000`;
            await redisClient.del(cacheKey);
            
            // Make the API request
            responseWithoutCache = await axios.get(`${LECTURES_API}?Engineering?page=1&limit=10000`);
            if (!responseWithoutCache) {
                console.log('Lecture not found in Redis cache');
                
              }
            timeWithoutCache = Date.now() - startWithoutCache;
            console.log(`- Time taken: ${timeWithoutCache} ms`);
            console.log(`- Documents retrieved: ${responseWithoutCache.data.lectures.length}`);
            console.log(`- Total documents: ${responseWithoutCache.data.pagination.total}`);
        } catch (error) {
            console.error("Error during first API call:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            throw error;
        }

        // Test 2: Fetch with cache
        console.log("\n2. Testing fetch WITH Redis cache:");
        const startWithCache = Date.now();
        try {
            // Make the same API request (should use cache)
            responseWithCache = await axios.get(`${LECTURES_API}?Engineering?page=1&limit=10000`);
            timeWithCache = Date.now() - startWithCache;
            console.log(`- Time taken: ${timeWithCache} ms`);
            console.log(`- Documents retrieved: ${responseWithCache.data.lectures.length}`);
            console.log(`- Total documents: ${responseWithCache.data.pagination.total}`);

            // Performance comparison
            console.log("\n3. Performance Comparison:");
            const improvement = timeWithoutCache - timeWithCache;
            console.log(`- Performance improvement: ${improvement} ms`);
            console.log(`- Improvement percentage: ${((improvement / timeWithoutCache) * 100).toFixed(2)}%`);

            // Assertions
            try {
                // Assert that cached query is faster
                assert(timeWithCache < timeWithoutCache, 
                    `Cached query (${timeWithCache}ms) should be faster than non-cached query (${timeWithoutCache}ms)`);
                
                // Assert that we got the same number of documents
                assert(responseWithoutCache.data.lectures.length === responseWithCache.data.lectures.length,
                    "Both queries should return the same number of documents");
                
                // Assert that pagination info is present
                assert(responseWithoutCache.data.pagination && responseWithCache.data.pagination,
                    "Response should include pagination information");
                
                console.log("\n All assertions passed!");
            } catch (error) {
                console.error("\n Test failed:", error.message);
            }
        } catch (error) {
            console.error("Error during second API call:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            throw error;
        }

   

        console.log("\nTest completed successfully.");
    } catch (error) {
        console.error("\n Test failed with error:", error.message);
        process.exit(1);
    }
}

// Run the test
measureRedisPerformance().catch(error => {
    console.error("Test failed with error:", error.message);
    process.exit(1);
}); 