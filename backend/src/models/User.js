import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Do not return password by default on queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationCode: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordCode: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash email verification token + 6-digit code (24 hours validity)
userSchema.methods.getVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationCode = code;
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
  return { token, code };
};

// Generate and hash password reset token + 6-digit reset code (1 hour validity)
userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordCode = code;
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  return { token, code };
};

// Target the 'GALL' collection shown in your MongoDB Atlas or process.env.COLLECTION_NAME
const collectionName = process.env.COLLECTION_NAME || 'GALL';
const User = mongoose.model('User', userSchema, collectionName);

export default User;

