import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  sha: { type: String, required: true },
  author: { type: String, default: 'Unknown' },
  message: { type: String, default: '' },
  additions: { type: Number, default: 0 },
  deletions: { type: Number, default: 0 },
  committedAt: { type: Date, required: true }
});

commitSchema.index({ repository: 1, sha: 1 }, { unique: true });

export default mongoose.model('Commit', commitSchema);