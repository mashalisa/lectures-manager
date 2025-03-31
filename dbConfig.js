const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URL with environment variable support
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'lecturesDB';
const assert = require("assert");

class Database {
    constructor() {
        // Updated connection options for better reliability
        const options = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 10,
            minPoolSize: 5,
            connectTimeoutMS: 10000,
            heartbeatFrequencyMS: 10000,
            family: 4  // Force IPv4
        };
        this.client = new MongoClient(url, options);
        this.db = null;
    }

    async connect() {
        try {
            // Check if already connected
            if (this.db) {
                return this.db;
            }

            // Add retry logic
            let retries = 5;
            while (retries > 0) {
                try {
                    await this.client.connect();
                    console.log('Connected to MongoDB');
                    
                    // Test the connection
                    await this.client.db('admin').command({ ping: 1 });
                    console.log('Database connection successful');
                    
                    this.db = this.client.db(dbName);
                    return this.db;
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    console.log(`Connection attempt failed. Retrying... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
                }
            }
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
    }

    async createCollectionIfNotExists(collectionName) {
        try {
            if (!this.db) {
                await this.connect();
            }
            
            const collections = await this.db.listCollections({ name: collectionName }).toArray();
            if (collections.length === 0) {
                await this.db.createCollection(collectionName);
                console.log(`Collection ${collectionName} created successfully`);
            } else {
                console.log(`Collection ${collectionName} already exists`);
            }
        } catch (error) {
            console.error(`Error ensuring collection ${collectionName}:`, error);
            throw new Error(`Failed to ensure collection: ${error.message}`);
        }
    }

    async insertDocument(collectionName, document) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.insertOne(document);
            console.log(`Document inserted with _id: ${result.insertedId}`);
            return result.insertedId;
        } catch (error) {
            console.error(`Error inserting document into ${collectionName}:`, error);
            throw new Error(`Failed to insert document: ${error.message}`);
        }
    }

    async updateDocument(collectionName, filter, update) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.updateOne(filter, { $set: update });
            console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
            return result.modifiedCount > 0;
        } catch (error) {
            console.error(`Error updating document in ${collectionName}:`, error);
            throw new Error(`Failed to update document: ${error.message}`);
        }
    }

    async deleteDocument(collectionName, filter) {
        try {
            const collection = this.db.collection(collectionName);
            const result = await collection.deleteOne(filter);
            console.log(`Deleted ${result.deletedCount} document(s)`);
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error deleting document from ${collectionName}:`, error);
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    async close() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('Disconnected from MongoDB');
                this.db = null;
            }
        } catch (error) {
            console.error('Error closing connection:', error);
            throw new Error(`Failed to close MongoDB connection: ${error.message}`);
        }
    }

    async fetchDocumentsWithPagination(collectionName, page = 1, pageSize = 50) {
        try {
            const collection = this.db.collection(collectionName);
            const skip = (page - 1) * pageSize;
            const documents = await collection.find().skip(skip).limit(pageSize).toArray();
            return documents;
        } catch (error) {
            console.error(`Error fetching documents from ${collectionName}:`, error);
            throw new Error(`Failed to fetch documents: ${error.message}`);
        }
    }

    // Example usage
    async initializeDatabase() {
        try {
            await this.createCollectionIfNotExists('lectures');
            // insert 10000 documents
            for (let i = 1; i <= 10000; i++) {
                const newLecture = {
                    title: `Lecture ${i}`,
                    category: 'Math',
                    description: 'This is a lecture',
                    date: new Date()
                };
                await this.insertDocument('lectures', newLecture);
            }

            //update 10 documents
            for(let i = 1; i <= 10; i++){
                await this.updateDocument('lectures', {title: `Lecture${i}`}, {title: 'Lecture ' + i});
            }

            //delete 20 documents
            for(let i = 1; i <= 20; i++){
                await this.deleteDocument('lectures', { title: `Lecture${i}` });
            }
        } catch (error) {
            console.error('Error initializing database:', error);
            throw new Error(`Failed to initialize database: ${error.message}`);
        }
    }
}

module.exports = Database;