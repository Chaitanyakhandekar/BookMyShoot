import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path:"./.env"});

export const connectDB = async () => {
  try {
    // MongoDB connection options
    

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Please ensure MongoDB is running or update MONGODB_URI in .env file');
    console.log('💡 You can use MongoDB Atlas (cloud) by updating MONGODB_URI');
    // Don't exit process, let the server start without DB for now
  }
};

