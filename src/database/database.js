const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Connecting to database...');
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch((err) => console.log(`Error when trying to connect to ${err}`));
};

module.exports = connectDB;