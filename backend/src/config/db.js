import mongoose from 'mongoose';

const DEFAULT_MONGO_URI =
  'mongodb+srv://tahiramehta28_db_user:h6d1fG5Gwb5KA3rB@cluster0.zv1cv65.mongodb.net/GAL?appName=Cluster0';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI?.trim() || DEFAULT_MONGO_URI;

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false, // Prevent infinite query buffering if connection drops
    });
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will stay running, but queries will fail until database connects.');
  }
};
