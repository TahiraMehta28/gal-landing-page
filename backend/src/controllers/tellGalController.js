import TellGalSubmission from '../models/TellGalSubmission.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to optionally resolve user from Authorization header if present
const resolveOptionalUser = async (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) {
          return await User.findById(decoded.id).select('-password');
        }
      }
    }
  } catch {
    // Ignore invalid/expired token and proceed gracefully
  }
  return null;
};

// @desc    Submit or update Tell GAL form response
// @route   POST /api/tell-gal
// @access  Public or Protected
export const submitOrUpdateTellGal = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers) {
      return res.status(400).json({ success: false, message: 'Answers are required' });
    }

    const authUser = await resolveOptionalUser(req);
    const emailFromForm = answers[5]?.email?.trim()?.toLowerCase() || '';
    const userEmail = authUser?.email?.toLowerCase() || emailFromForm;
    const userId = authUser?._id || null;

    let submission = null;

    // First try finding by user ID if logged in
    if (userId) {
      submission = await TellGalSubmission.findOne({ user: userId });
    }

    // If not found by user ID, try finding by email
    if (!submission && userEmail) {
      submission = await TellGalSubmission.findOne({ userEmail });
    }

    if (submission) {
      // Update existing submission
      submission.answers = answers;
      if (userId && !submission.user) {
        submission.user = userId;
      }
      if (userEmail) {
        submission.userEmail = userEmail;
      }
      submission.status = 'submitted';
      await submission.save();

      return res.status(200).json({
        success: true,
        message: 'Tell GAL response updated successfully',
        data: submission,
      });
    }

    // Create new submission
    submission = await TellGalSubmission.create({
      user: userId,
      userEmail: userEmail,
      answers,
      status: 'submitted',
    });

    return res.status(201).json({
      success: true,
      message: 'Tell GAL response submitted successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Error submitting Tell GAL response:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving response',
    });
  }
};

// @desc    Get current user's Tell GAL response
// @route   GET /api/tell-gal/my-submission
// @access  Public (with query email) or Protected (with token)
export const getMySubmission = async (req, res) => {
  try {
    const authUser = await resolveOptionalUser(req);
    const queryEmail = req.query.email?.trim()?.toLowerCase();

    let submission = null;

    if (authUser?._id) {
      submission = await TellGalSubmission.findOne({ user: authUser._id });
    }

    const email = authUser?.email?.toLowerCase() || queryEmail;
    if (!submission && email) {
      submission = await TellGalSubmission.findOne({ userEmail: email });
      // If found by email and user is logged in, link user ID
      if (submission && authUser?._id && !submission.user) {
        submission.user = authUser._id;
        await submission.save();
      }
    }

    if (!submission) {
      return res.status(200).json({
        success: true,
        data: null,
        hasResponded: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
      hasResponded: true,
    });
  } catch (error) {
    console.error('Error fetching Tell GAL response:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching response',
    });
  }
};
