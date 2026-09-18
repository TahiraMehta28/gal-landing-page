import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI?.trim();
    if (!uri) {
      console.warn('⚠️ MONGO_URI environment variable is missing.');
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false,
    });
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will stay running, but queries will fail until database connects.');
  }
};
