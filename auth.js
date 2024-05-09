const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, 12345678 , { expiresIn: '1h' });
};

const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = { generateToken, comparePassword };
