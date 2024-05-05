import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 */
const connectDB = async () => {
    try {
        // Create the MongoDB connection string depending on the environment
        const userpass = process.env.MONGO_USER ? `${process.env.MONGO_USER!}:${process.env.MONGO_PASSWORD!}@` : '';
        const uri = `mongodb://${userpass}${process.env.MONGO_URI!}?authSource=admin`;
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectDB;