import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
  githubId: { type: Number, required: true },
  number: { type: Number, required: true },
  title: { type: String, default: '' },
  state: { type: String, enum: ['open', 'closed'], required: true },
  createdAt: { type: Date, required: true },
  closedAt: { type: Date, default: null }
});

issueSchema.index({ repository: 1, githubId: 1 }, { unique: true });

export default mongoose.model('Issue', issueSchema);