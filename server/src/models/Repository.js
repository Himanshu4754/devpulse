import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    githubId: {
      type: Number,
      required: true
    },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, default: '' },
    defaultBranch: { type: String, default: 'main' },
    private: { type: Boolean, default: false },
    lastSyncedAt: { type: Date, default: null },
    insights: {
      type: [
        {
          type: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
          title: { type: String, required: true },
          description: { type: String, required: true }
        }
      ],
      default: []
    },
    insightsGeneratedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

repositorySchema.index({ owner: 1, fullName: 1 }, { unique: true });

export default mongoose.model('Repository', repositorySchema);