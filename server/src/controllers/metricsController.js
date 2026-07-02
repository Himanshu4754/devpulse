import { computeRepositoryMetrics } from '../services/metricsService.js';
import { getRepositoryById } from '../services/repositoryService.js';

export const getMetrics = async (req, res, next) => {
  try {
    // Confirms the repo belongs to this user before computing anything
    await getRepositoryById(req.user._id, req.params.id);
    const metrics = await computeRepositoryMetrics(req.params.id);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};