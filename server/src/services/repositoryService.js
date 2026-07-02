import Repository from '../models/Repository.js';
import Commit from '../models/Commit.js';
import PullRequest from '../models/PullRequest.js';
import Issue from '../models/Issue.js';
import User from '../models/User.js';
import {
  fetchRepoDetails,
  fetchCommits,
  fetchPullRequests,
  fetchIssues
} from './githubService.js';

export const connectRepository = async (userId, githubToken, fullName) => {
  const [owner, repo] = fullName.split('/');
  if (!owner || !repo) {
    const error = new Error('Repository must be in "owner/repo" format');
    error.statusCode = 400;
    throw error;
  }

  // Save the token on the user so future syncs don't require re-entering it
  await User.findByIdAndUpdate(userId, { githubToken });

  const details = await fetchRepoDetails(githubToken, owner, repo);

  const repository = await Repository.findOneAndUpdate(
    { owner: userId, fullName: details.full_name },
    {
      owner: userId,
      githubId: details.id,
      name: details.name,
      fullName: details.full_name,
      description: details.description || '',
      defaultBranch: details.default_branch,
      private: details.private
    },
    { upsert: true, new: true }
  );

  await syncRepositoryData(repository._id, githubToken, owner, repo);

  return repository;
};

export const syncRepositoryData = async (repositoryId, githubToken, owner, repo) => {
  const [commits, pullRequests, issues] = await Promise.all([
    fetchCommits(githubToken, owner, repo),
    fetchPullRequests(githubToken, owner, repo),
    fetchIssues(githubToken, owner, repo)
  ]);

  // Upsert each record so re-syncing doesn't create duplicates
  await Promise.all(
    commits.map((c) =>
      Commit.findOneAndUpdate(
        { repository: repositoryId, sha: c.sha },
        { ...c, repository: repositoryId },
        { upsert: true }
      )
    )
  );

  await Promise.all(
    pullRequests.map((pr) =>
      PullRequest.findOneAndUpdate(
        { repository: repositoryId, githubId: pr.githubId },
        { ...pr, repository: repositoryId },
        { upsert: true }
      )
    )
  );

  await Promise.all(
    issues.map((i) =>
      Issue.findOneAndUpdate(
        { repository: repositoryId, githubId: i.githubId },
        { ...i, repository: repositoryId },
        { upsert: true }
      )
    )
  );

  await Repository.findByIdAndUpdate(repositoryId, { lastSyncedAt: new Date() });
};

export const getUserRepositories = async (userId) => {
  return Repository.find({ owner: userId }).sort({ createdAt: -1 });
};

export const getRepositoryById = async (userId, repoId) => {
  const repository = await Repository.findOne({ _id: repoId, owner: userId });
  if (!repository) {
    const error = new Error('Repository not found');
    error.statusCode = 404;
    throw error;
  }
  return repository;
};

export const refreshRepository = async (userId, repoId) => {
  const repository = await getRepositoryById(userId, repoId);
  const user = await User.findById(userId);
  const [owner, repo] = repository.fullName.split('/');

  await syncRepositoryData(repository._id, user.githubToken, owner, repo);
  return getRepositoryById(userId, repoId);
};