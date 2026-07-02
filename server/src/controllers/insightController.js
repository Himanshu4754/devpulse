import Repository from '../models/Repository.js';
import { computeRepositoryMetrics } from '../services/metricsService.js';
import { generateInsights } from '../services/aiService.js';
import { getRepositoryById } from '../services/repositoryService.js';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const getInsights = async (req, res, next) => {
  try {
    const repository = await getRepositoryById(req.user._id, req.params.id);

    const isFresh =
      repository.insightsGeneratedAt &&
      Date.now() - new Date(repository.insightsGeneratedAt).getTime() < CACHE_TTL_MS;

    if (isFresh && repository.insights.length) {
      return res.json({ insights: repository.insights, generatedAt: repository.insightsGeneratedAt, cached: true });
    }

    const metrics = await computeRepositoryMetrics(repository._id);
    const insights = await generateInsights(repository.fullName, metrics);

    repository.insights = insights;
    repository.insightsGeneratedAt = new Date();
    await repository.save();

    res.json({ insights, generatedAt: repository.insightsGeneratedAt, cached: false });
  } catch (error) {
    next(error);
  }
};

export const regenerateInsights = async (req, res, next) => {
  try {
    const repository = await getRepositoryById(req.user._id, req.params.id);
    const metrics = await computeRepositoryMetrics(repository._id);
    const insights = await generateInsights(repository.fullName, metrics);

    repository.insights = insights;
    repository.insightsGeneratedAt = new Date();
    await repository.save();

    res.json({ insights, generatedAt: repository.insightsGeneratedAt, cached: false });
  } catch (error) {
    next(error);
  }
};