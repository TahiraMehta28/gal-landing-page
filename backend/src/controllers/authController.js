import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const checkDbConnection = (res) => {
  if (process.env.MONGO_URI?.includes('cluster0.xxxxx')) {
    res.status(503).json({
      success: false,
      message:
        'Database configuration pending: Please replace the placeholder "cluster0.xxxxx" in backend/.env with your real MongoDB Atlas cluster URL.',
    });
    return false;
  }
  return true;
};

// @desc    Register a new user (Sends Email Confirmation)
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    let user;

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please sign in.',
        });
      }
      // If user registered before but never confirmed email, update and resend
      existingUser.name = name.trim();
      existingUser.password = password;
      user = existingUser;
    } else {
      user = new User({
        name: name.trim(),
        email: cleanEmail,
        password,
        isVerified: false,
      });
    }

    // Generate 6-digit confirmation code
    const { code: verificationCode } = user.getVerificationToken();
    user.verificationCode = String(verificationCode).trim();
    await user.save();

    // Log verification code clearly in server logs
    console.log(`🔑 Verification code for ${user.email} is: [${verificationCode}]`);

    // Send confirmation email in background without blocking HTTP response
    console.log(`📧 Dispatching signup OTP verification email to: ${user.email}`);
    sendEmail({
      to: user.email,
      clientOrigin: req.headers.origin || req.headers.referer,
      subject: 'Your Verification Code - GAL Acceleration Lab',
      text: `Hello ${user.name},\n\nYour 6-digit verification code is: ${verificationCode}\n\nEnter this code in the signup screen to complete your registration.\n\nThis code will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF7; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h1 style="color: #161616; font-size: 22px; margin-bottom: 4px;">Email Verification Code</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Global Acceleration Lab (GAL)</p>
          </div>
          <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 20px 0 10px;">
            Hello <b>${user.name}</b>,
          </p>
          <p style="color: #475569; font-size: 14px; margin-top: 0;">
            Please enter this 6-digit code to complete your signup:
          </p>
          <div style="margin: 28px 0;">
            <div style="display: inline-block; background: #161616; color: #E4C55A; letter-spacing: 8px; font-size: 32px; font-weight: bold; padding: 14px 28px; border-radius: 12px;">
              ${verificationCode}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This confirmation code expires in 24 hours. If you did not request this, please safely ignore this email.
          </p>
        </div>
      `,
    }).catch((err) => console.warn(`⚠️ Verification email delivery warning:`, err.message));

    return res.status(201).json({
      success: true,
      message: 'Verification code sent to your email. Please check your inbox.',
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during sign up',
    });
  }
};

// @desc    Verify 6-Digit Code
// @route   POST /api/auth/verify-code
// @access  Public
export const verifyCode = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Please provide both email and 6-digit code' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').toString().replace(/\D/g, '');

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please sign up first.',
      });
    }

    if (user.isVerified) {
      const authToken = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Account is already verified! Signing you in...',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: authToken,
        },
      });
    }

    const storedCode = (user.verificationCode || '').toString().trim();
    console.log(`🔐 Comparing OTP for ${user.email} -> Entered: [${cleanCode}] vs Stored: [${storedCode}]`);

    if (!storedCode || storedCode !== cleanCode) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect 6-digit code. Please enter the latest code sent to your email.',
      });
    }

    if (user.verificationTokenExpire && new Date(user.verificationTokenExpire).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'This confirmation code has expired. Please click "Resend Code" to get a new code.',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationCode = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Email confirmed successfully! Your account is now active.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: authToken,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying code' });
  }
};

// @desc    Verify Email using Token
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired confirmation link. Please request a new verification email.',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Email confirmed successfully! Your account is now active.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: authToken,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error verifying email',
    });
  }
};

// @desc    Resend Verification Email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account is already confirmed. Please sign in.' });
    }

    const { code: verificationCode } = user.getVerificationToken();
    await user.save();

    // Log verification code clearly in server logs
    console.log(`🔑 Resent verification code for ${user.email} is: [${verificationCode}]`);

    console.log(`📧 Resending verification OTP to: ${user.email}`);
    sendEmail({
      to: user.email,
      clientOrigin: req.headers.origin || req.headers.referer,
      subject: 'Your New Verification Code - GAL Acceleration Lab',
      text: `Hello ${user.name},\n\nYour new 6-digit verification code is: ${verificationCode}\n\nEnter this code in the signup screen to complete your registration.\n\nThis code will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF7; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h1 style="color: #161616; font-size: 22px; margin-bottom: 4px;">New Verification Code</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Global Acceleration Lab (GAL)</p>
          </div>
          <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 20px 0 10px;">
            Hello <b>${user.name}</b>,
          </p>
          <p style="color: #475569; font-size: 14px; margin-top: 0;">
            Here is your new 6-digit confirmation code:
          </p>
          <div style="margin: 28px 0;">
            <div style="display: inline-block; background: #161616; color: #E4C55A; letter-spacing: 8px; font-size: 32px; font-weight: bold; padding: 14px 28px; border-radius: 12px;">
              ${verificationCode}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This confirmation code expires in 24 hours.
          </p>
        </div>
      `,
    }).catch((err) => console.warn(`⚠️ Resend verification warning:`, err.message));

    return res.status(200).json({
      success: true,
      message: 'New 6-digit verification code sent! Please check your email.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ success: false, message: 'Error resending verification email' });
  }
};

// @desc    Authenticate user & login (Sign In - No verification check required)
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during sign in',
    });
  }
};

// @desc    Forgot Password Request (Sends Reset Link Email)
// @desc    Forgot Password Request (Sends 6-Digit Reset Code & Link Email)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    const { token: resetToken, code: resetCode } = user.getResetPasswordToken();
    await user.save();

    // Log reset code clearly in server logs
    console.log(`🔑 Password reset code for ${user.email} is: [${resetCode}]`);

    console.log(`📧 Sending password reset code email to: ${user.email}`);
    sendEmail({
      to: user.email,
      clientOrigin: req.headers.origin || req.headers.referer,
      subject: 'Password Reset Code - GAL Acceleration Lab',
      text: `Hello ${user.name},\n\nYour 6-digit password reset code is: ${resetCode}\n\nEnter this code in the password reset form along with your new password.\n\nThis code will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF7; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h1 style="color: #161616; font-size: 22px; margin-bottom: 4px;">Password Reset Code</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Global Acceleration Lab (GAL)</p>
          </div>
          <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 20px 0 10px;">
            Hello <b>${user.name}</b>,
          </p>
          <p style="color: #475569; font-size: 14px; margin-top: 0;">
            Here is your 6-digit code to reset your password:
          </p>
          <div style="margin: 28px 0;">
            <div style="display: inline-block; background: #161616; color: #E4C55A; letter-spacing: 8px; font-size: 32px; font-weight: bold; padding: 14px 28px; border-radius: 12px;">
              ${resetCode}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This reset code expires in 1 hour. If you did not request this, please safely ignore this email.
          </p>
        </div>
      `,
    }).catch((err) => console.warn(`⚠️ Password reset code email warning:`, err.message));

    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email! Please check your inbox.',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error processing forgot password request',
    });
  }
};

// @desc    Reset Password using Code or Token
// @route   POST /api/auth/reset-password or POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const token = req.params?.token || req.body?.token;
    const { password, email, code } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
    }

    let user;

    if (token) {
      // Verification via token link
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Reset link is invalid or expired. Please request a new one.',
        });
      }
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address.',
        });
      }

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Please provide the 6-digit verification code sent to your email.',
        });
      }

      const cleanCode = String(code).replace(/\D/g, '').trim();
      const storedCode = (user.resetPasswordCode || '').toString().trim();
      console.log(`🔐 Reset password code check for ${user.email} -> Entered: [${cleanCode}] Stored: [${storedCode}] Expire: ${user.resetPasswordExpire}`);

      const isValidCode =
        storedCode &&
        storedCode === cleanCode &&
        user.resetPasswordExpire &&
        user.resetPasswordExpire > Date.now();

      if (!isValidCode) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired 6-digit reset code.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email and new password',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send security email alert that password was changed in background
    console.log(`📧 Sending password reset security alert to: ${user.email}`);
    sendEmail({
      to: user.email,
      clientOrigin: req.headers.origin || req.headers.referer,
      subject: 'Security Alert: Password Updated - GAL Acceleration Lab',
      text: `Hello ${user.name},\n\nYour password for GAL Acceleration Lab was successfully updated.\n\nIf you made this change, no action is needed.\n\nIf you did NOT make this change, please contact support or reset your password immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF7; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h1 style="color: #161616; font-size: 22px; margin-bottom: 4px;">Security Alert</h1>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Global Acceleration Lab (GAL)</p>
          </div>
          <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 20px 0 10px;">
            Hello <b>${user.name}</b>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Your account password was just successfully updated.
          </p>
          <div style="background: #f1f5f9; padding: 14px; border-radius: 10px; margin: 20px 0; color: #475569; font-size: 13px; line-height: 1.5;">
            If you made this change, no further action is required.<br/>
            If you did <b>not</b> make this change, please reset your password immediately.
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This is an automated security notification for your account.
          </p>
        </div>
      `,
    }).catch((err) => console.warn('⚠️ Password reset email delivery warning:', err.message));

    const authToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in with your new password.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: authToken,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password',
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile',
    });
  }
};

// @desc    Update user profile (Name, Email, Password)
// @route   PATCH /api/auth/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    if (!checkDbConnection(res)) return;
    const { name, email, newPassword, currentPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found or session expired.',
      });
    }

    if (name && name.trim()) user.name = name.trim();
    if (email && email.trim()) user.email = email.trim().toLowerCase();

    let passwordChanged = false;
    // Change password if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your current (old) password to set a new password.',
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password. Please enter your valid old password.',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long.',
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password cannot be the same as your current password.',
        });
      }

      user.password = newPassword;
      passwordChanged = true;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id);

    // If password was changed, send email alert in background
    if (passwordChanged) {
      console.log(`📧 Sending password change security alert to: ${updatedUser.email}`);
      sendEmail({
        to: updatedUser.email,
        clientOrigin: req.headers.origin || req.headers.referer,
        subject: 'Security Alert: Password Changed - GAL Acceleration Lab',
        text: `Hello ${updatedUser.name},\n\nYour password for GAL Acceleration Lab was successfully changed from your profile.\n\nIf you made this change, no action is needed.\n\nIf you did NOT make this change, please contact support or reset your password immediately.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #FAFAF7; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
            <div style="margin-bottom: 20px;">
              <h1 style="color: #161616; font-size: 22px; margin-bottom: 4px;">Security Alert</h1>
              <p style="color: #64748b; font-size: 13px; margin: 0;">Global Acceleration Lab (GAL)</p>
            </div>
            <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 20px 0 10px;">
              Hello <b>${updatedUser.name}</b>,
            </p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
              Your account password was just changed from your profile settings.
            </p>
            <div style="background: #f1f5f9; padding: 14px; border-radius: 10px; margin: 20px 0; color: #475569; font-size: 13px; line-height: 1.5;">
              If you made this change, no further action is required.<br/>
              If you did <b>not</b> make this change, please contact support immediately.
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              This is an automated security notification for your account.
            </p>
          </div>
        `,
      }).catch((err) => console.warn('⚠️ Password change email warning:', err.message));
    }

    return res.status(200).json({
      success: true,
      message: passwordChanged
        ? 'Password and profile updated successfully! An email alert has been sent.'
        : 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating profile',
    });
  }
};
