import { computeRepositoryMetrics } from '../services/metricsService.js';
import { getRepositoryById } from '../services/repositoryService.js';

export const compareRepositories = async (req, res, next) => {
  try {
    const { repoIdA, repoIdB } = req.query;

    if (!repoIdA || !repoIdB) {
      const error = new Error('Both repoIdA and repoIdB query params are required');
      error.statusCode = 400;
      throw error;
    }

    // Ownership check happens per-repo — a user can never compare a repo they don't own
    const [repoA, repoB] = await Promise.all([
      getRepositoryById(req.user._id, repoIdA),
      getRepositoryById(req.user._id, repoIdB)
    ]);

    const [metricsA, metricsB] = await Promise.all([
      computeRepositoryMetrics(repoA._id),
      computeRepositoryMetrics(repoB._id)
    ]);

    res.json({
      repositories: [
        { id: repoA._id, fullName: repoA.fullName, metrics: metricsA },
        { id: repoB._id, fullName: repoB.fullName, metrics: metricsB }
      ]
    });
  } catch (error) {
    next(error);
  }
};