import {
  connectRepository,
  getUserRepositories,
  getRepositoryById,
  refreshRepository
} from '../services/repositoryService.js';

export const connect = async (req, res, next) => {
  try {
    const { githubToken, fullName } = req.body;
    const repository = await connectRepository(req.user._id, githubToken, fullName);
    res.status(201).json(repository);
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const repositories = await getUserRepositories(req.user._id);
    res.json(repositories);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const repository = await getRepositoryById(req.user._id, req.params.id);
    res.json(repository);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const repository = await refreshRepository(req.user._id, req.params.id);
    res.json(repository);
  } catch (error) {
    next(error);
  }
};