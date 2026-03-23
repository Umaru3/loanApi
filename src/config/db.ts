import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected:', conn.connection.host);
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}