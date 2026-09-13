import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Inserting test user into database GAL...');

    const testEmail = `test_${Date.now()}@example.com`;
    const user = await User.create({
      name: 'Initial Test User',
      email: testEmail,
      password: 'StrongPassword123!',
      role: 'user',
    });

    console.log('✅ Success! Test record created with all fields:');
    console.log(user);
    console.log('\nRefresh your MongoDB Atlas Data Explorer now to see the fields & document!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test record:', error.message);
    process.exit(1);
  }
};

seed();
