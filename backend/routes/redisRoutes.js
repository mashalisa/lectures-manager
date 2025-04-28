const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redis.js');

// Health check endpoint
router.get('/health_check', async (req, res) => {
  try {
    // Check if using fallback
    if (redisClient.isUsingFallback()) {
      return res.json({
        status: 'OK',
        redis: 'fallback',
        message: 'Using in-memory fallback instead of Redis'
      });
    }
    
    // Try to ping Redis
    const ping = await redisClient.ping();
    
    // Return appropriate response
    if (ping === 'PONG') {
      return res.json({
        status: 'OK',
        redis: 'connected',
        ping: ping
      });
    } else {
      return res.status(500).json({
        status: 'FAIL',
        redis: 'unhealthy',
        ping: ping
      });
    }
  } catch (error) {
    return res.status(503).json({
      status: 'UNAVAILABLE',
      redis: 'error',
      error: error.message
    });
  }
});


module.exports = router; 