const express = require('express');
const Database = require('./dbConfig');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new Database();

// app.get('/lectures', async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = 50; // Fixed page size

//     try {
//         await db.connect();
//         const lectures = await db.fetchDocumentsWithPagination('lectures', page, pageSize);
//         res.json(lectures);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     } finally {
//         await db.close();
//     }
// });

//insert new user

app.post('/create-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate required fields
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        // Create user document
        const newUser = {
            username: username,
            password: password, // Note: In a real app, you should hash this
            createdAt: new Date()
        };
        
        // Connect and insert the user
        await db.connect();
        const userId = await db.insertDocument('users', newUser);
        
        res.json({ 
            success: true, 
            message: 'User created successfully',
            userId: userId 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    } finally {
        await db.close();
    }
});

app.get('edit')


// Get all users
app.get('/users', async (req, res) => {
    try {
        await db.connect();
        const users = await db.fetchDocumentsWithPagination('users', 1, 50);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await db.close();
    }
});

// Initialize users collection if needed
app.get('/init-users', async (req, res) => {
    try {
        await db.connect();
        await db.createCollectionIfNotExists('users');
        res.json({ message: 'Users collection initialized' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await db.close();
    }
});

// Fix the initialize route
app.get('/initialize-database', async (req, res) => {
    try {
        await db.initializeDatabase();
        res.json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fix the delete route
app.get('/delete-database', async (req, res) => {
    try {
        await db.deleteDatabase();
        res.json({ message: 'Database deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fix the performance test route
app.get('/test-query-performance', async (req, res) => {
    try {
        await db.testQueryPerformance();
        res.json({ message: 'Query performance test completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/_/health_check', async (req,res)=> {
    res.status(200).json("healthy");
})



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});