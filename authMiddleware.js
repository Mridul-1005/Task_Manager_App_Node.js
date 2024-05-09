// authMiddleware.js
const jwt = require('jsonwebtoken');
const connection = require('./db');

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(401).json({ error: 'No token provided' });
//     }
//     jwt.verify(token, 12345678 , async (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ error: 'Invalid token' });
//         }
//         const query = 'SELECT * FROM users WHERE id = ?';
//         const [user] = await connection.query(query, [decoded.id]);
//         if (!user) {
//             return res.status(401).json({ error: 'User not found' });
//         }
//         req.user = user[0];
//         next();
//     });
// };


const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, username, role } = decoded;
        req.email = email;
        req.name = username;
        req.role = role;
        next();
    } catch {
        next('Authentication Failure');
    }
}

// authMiddleware.js
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
};


module.exports = { verifyToken, isAdmin };
