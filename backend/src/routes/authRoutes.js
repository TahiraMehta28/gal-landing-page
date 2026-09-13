import express from 'express';
import {
  signup,
  signin,
  verifyEmail,
  verifyCode,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/signup', signup);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-code', verifyCode);
router.post('/resend-verification', resendVerification);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/reset-password/:token', resetPassword);

// Protected account endpoints
router.get('/me', protect, getMe);
router.patch('/update', protect, updateProfile);

export default router;
