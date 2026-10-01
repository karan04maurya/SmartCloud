const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        
        await mongoose.connect(uri);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        // process.exit(1); // Do not crash the server if MongoDB isn't configured properly
    }
};

module.exports = connectMongoDB;
