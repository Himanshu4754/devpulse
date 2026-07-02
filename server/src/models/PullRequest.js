import mongoose from 'mongoose';

const pullRequestSchema = new mongoose.Schema({
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  githubId: { type: Number, required: true },
  number: { type: Number, required: true },
  title: { type: String, default: '' },
  author: { type: String, default: 'Unknown' },
  state: { type: String, enum: ['open', 'closed'], required: true },
  merged: { type: Boolean, default: false },
  createdAt: { type: Date, required: true },
  closedAt: { type: Date, default: null },
  mergedAt: { type: Date, default: null }
});

pullRequestSchema.index({ repository: 1, githubId: 1 }, { unique: true });

export default mongoose.model('PullRequest', pullRequestSchema);