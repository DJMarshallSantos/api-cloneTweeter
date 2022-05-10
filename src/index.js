require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require('./database/database');
const userRoute = require('./users/users.routes')
const authRoute = require('./auth/auth.routes');
const tweetsRoute = require("./tweets/tweets.routes");
const port = process.env.PORT||5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/tweets', tweetsRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});