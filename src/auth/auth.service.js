const User = require('../users/User');
const jwt = require('jsonwebtoken');


const loginService = (email) => User.findOne({ email: email}).select('+password');
const generateToken = (userID) => {
    return jwt.sign({ id: userID }, process.env.SECRET, { expiresIn: 86400 });
};

module.exports = { loginService, generateToken };