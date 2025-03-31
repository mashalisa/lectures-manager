const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lectures API',
      version: '1.0.0',
      description: 'API documentation for the Lectures application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;