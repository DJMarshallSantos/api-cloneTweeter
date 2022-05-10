const userService = require('./users.service');
const authService = require('../auth/auth.service');

const createUserController = async (req, res) => {
    const { name, username, email, password, avatar } = req.body;
    
    if (!name || !username || !email || !password || !avatar) {
        return res.status(400).send({ message: 'Please fill all the required fields.' });
    }

    const foundUser = await userService.findByEmailUserService(email);

    if (foundUser) { 
        return res.status(400).send({ message: 'User already exists.' });
    }
    
    const user = await userService.createUserService(req.body)
    .catch((err) => console.log(err, message));

    if (!user) {
        return res.status(400).send({ message: 'User could not be created.' });
    }
    
    const token = authService.generateToken(user.id);

    res.status(201).send({
        user: {
            id: user.id,
            name,
            username,
            email,
            avatar
        },
        token
    });
};

const findAllUserController = async (req, res) => {
    const users = await userService.findAllUserService();

    if (users.length === 0) {
        return res.status(400).send({ message: 'No users found.' });
    };
    
    res.send(users);
};

module.exports = {createUserController, findAllUserController};