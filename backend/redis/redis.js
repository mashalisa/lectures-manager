// redis.js - Simple Redis client with fallback
// This file provides a simple way to store and retrieve data
// If Redis is not available, it will use in-memory storage instead

const { createClient } = require('redis');

// In-memory storage to use when Redis is not available
const memoryStore = new Map();

// Flag to track if we're using Redis or memory
let usingMemory = true;

// Create Redis client
let redisClient = null;

// Try to connect to Redis
async function connectToRedis() {
  try {
    // Create Redis client
    redisClient = createClient({
      url: 'redis://localhost:6379'  // Default Redis URL
    });

    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis');
    usingMemory = false;
  } catch (error) {
    // If Redis is not available, use memory storage
    console.log('Redis not available, using memory storage');
    usingMemory = true;
  }
}

// Get a value by key
async function get(key) {
  // If using memory, get from memory store
  if (usingMemory) {
    return memoryStore.get(key);
  }
  
  // Otherwise, get from Redis
  try {
    return await redisClient.get(key);
  } catch (error) {
    // If Redis fails, fall back to memory
    usingMemory = true;
    return memoryStore.get(key);
  }
}

// Set a value for a key with expiration
async function setEx(key, seconds, value) {
  // If using memory, store in memory (no expiration in memory)
  if (usingMemory) {
    memoryStore.set(key, value);
    return 'OK';
  }
  
  // Otherwise, store in Redis with expiration
  try {
    return await redisClient.setEx(key, seconds, value);
  } catch (error) {
    // If Redis fails, fall back to memory
    usingMemory = true;
    memoryStore.set(key, value);
    return 'OK';
  }
}

// Set a value for a key without expiration
async function set(key, value) {
  // If using memory, store in memory
  if (usingMemory) {
    memoryStore.set(key, value);
    return 'OK';
  }
  
  // Otherwise, store in Redis
  try {
    return await redisClient.set(key, value);
  } catch (error) {
    // If Redis fails, fall back to memory
    usingMemory = true;
    memoryStore.set(key, value);
    return 'OK';
  }
}

// Delete a key
async function del(key) {
  // If using memory, delete from memory
  if (usingMemory) {
    return memoryStore.delete(key) ? 1 : 0;
  }
  
  // Otherwise, delete from Redis
  try {
    return await redisClient.del(key);
  } catch (error) {
    // If Redis fails, fall back to memory
    usingMemory = true;
    return memoryStore.delete(key) ? 1 : 0;
  }
}

// Get all keys matching a pattern
async function keys(pattern) {
  // If using memory, get keys from memory
  if (usingMemory) {
    const keys = Array.from(memoryStore.keys());
    if (pattern === '*') return keys;
    return keys.filter(key => key.includes(pattern.replace('*', '')));
  }
  
  // Otherwise, get keys from Redis
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    // If Redis fails, fall back to memory
    usingMemory = true;
    const keys = Array.from(memoryStore.keys());
    if (pattern === '*') return keys;
    return keys.filter(key => key.includes(pattern.replace('*', '')));
  }
}

// Try to connect to Redis when this file is loaded
connectToRedis().catch(error => {
  console.log(' Could not connect to Redis:', error.message);
  usingMemory = true;
});

console.log(' Redis client initialized');

// Export the Redis client functions
module.exports = {
  get,
  set,
  setEx,
  del,
  keys
}; 