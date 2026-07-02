import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    githubToken: {
      type: String, // Personal Access Token, added in Phase 3 — stored here for now
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);