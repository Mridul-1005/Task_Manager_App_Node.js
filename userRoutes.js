const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('./db');
const jwt = require('jsonwebtoken');
const { generateToken, comparePassword } = require('./auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        await connection.query(query, [username, email, hashedPassword, role]);
        res.json({ message: 'User registered successfully' });
        console.log('running');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        const values = [
            req.body.username
        ]
        connection.query(sql, [values], async (err, result) => {
            if (err) return res.json("Error occurerd");
            if (result.length > 0) {
                const isValid = await bcrypt.compare(req.body.password, result[0].password);
                if (isValid) {
                    const token = jwt.sign({
                        email: result[0].email,
                        username: result[0].username,
                        role : result[0].role
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });

                    return res.status(200).json({
                        authentication_token: token,
                        message: 'Successfully Login'
                    });
                } else {
                    return res.status(400).json("Login Failed");
                }
            } else return res.status(500).json("Login Failed");
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login Failed' });
    }
})

module.exports = router;
