import mongoose from 'mongoose';

const tellGalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    answers: {
      1: { type: String, default: '' },
      2: { type: String, default: '' },
      3: { type: [String], default: [] },
      4: { type: String, default: '' },
      5: {
        persona: { type: String, default: '' },
        name: { type: String, default: '' },
        org: { type: String, default: '' },
        role: { type: String, default: '' },
        location: { type: String, default: '' },
        email: { type: String, default: '' },
        mobile: { type: String, default: '' },
      },
      6: { type: [String], default: [] },
    },
    status: {
      type: String,
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
);

// Index on user and userEmail for fast retrieval
tellGalSchema.index({ user: 1 });
tellGalSchema.index({ userEmail: 1 });

const TellGalSubmission = mongoose.model(
  'TellGalSubmission',
  tellGalSchema,
  'tell_gal_submissions'
);

export default TellGalSubmission;
