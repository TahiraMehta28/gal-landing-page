import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('cluster0.xxxxx')) {
      console.warn('\n⚠️  ACTION NEEDED IN backend/.env:');
      console.warn('Your MONGO_URI still contains the placeholder "cluster0.xxxxx.mongodb.net".');
      console.warn('Please replace it with your real MongoDB Atlas connection string.\n');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will stay running, but please update backend/.env with your valid MongoDB connection string.');
  }
};
