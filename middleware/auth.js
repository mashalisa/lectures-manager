const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};


// Middleware to check if user is Teacher
const isTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).json({ message: 'teacher access required' });
    }
};


const requireRole = (req, res, next) => {
    if (req.user?.role === 'teacher' || req.user?.role === 'admin') {
        return next(); // If either role is true, proceed
    }
    return res.status(403).json({ message: "Access denied. Admin or Teacher role required." });
};
module.exports = { auth, isAdmin, isTeacher , requireRole}; 



// auth Middleware

// Extracts the JWT token from the Authorization header (Bearer token... format).

// Verifies the token using jwt.verify().

// If valid, attaches the decoded user data (req.user) to the request and calls next().

// If invalid or missing, it sends a 401 Unauthorized response.

// isAdmin Middleware

// Checks if req.user.role === 'admin'.

// If yes, it allows the request to continue (next()).

// Otherwise, it returns a 403 Forbidden error.