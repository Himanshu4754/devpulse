import axios from 'axios';

const githubApi = (token) =>
  axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  });

export const fetchRepoDetails = async (token, owner, repo) => {
  const api = githubApi(token);
  const { data } = await api.get(`/repos/${owner}/${repo}`);
  return data;
};

export const fetchCommits = async (token, owner, repo, perPage = 100) => {
  const api = githubApi(token);
  const { data } = await api.get(`/repos/${owner}/${repo}/commits`, {
    params: { per_page: perPage }
  });

  // Commit list endpoint doesn't include additions/deletions —
  // need one extra call per commit to get stats. Capped to keep this fast for MVP.
  const detailed = await Promise.all(
    data.slice(0, 50).map(async (c) => {
      try {
        const { data: full } = await api.get(`/repos/${owner}/${repo}/commits/${c.sha}`);
        return {
          sha: c.sha,
          author: c.commit.author?.name || 'Unknown',
          message: c.commit.message,
          additions: full.stats?.additions || 0,
          deletions: full.stats?.deletions || 0,
          committedAt: c.commit.author?.date
        };
      } catch {
        return {
          sha: c.sha,
          author: c.commit.author?.name || 'Unknown',
          message: c.commit.message,
          additions: 0,
          deletions: 0,
          committedAt: c.commit.author?.date
        };
      }
    })
  );

  return detailed;
};

export const fetchPullRequests = async (token, owner, repo, perPage = 100) => {
  const api = githubApi(token);
  const { data } = await api.get(`/repos/${owner}/${repo}/pulls`, {
    params: { state: 'all', per_page: perPage }
  });

  return data.map((pr) => ({
    githubId: pr.id,
    number: pr.number,
    title: pr.title,
    author: pr.user?.login || 'Unknown',
    state: pr.state,
    merged: !!pr.merged_at,
    createdAt: pr.created_at,
    closedAt: pr.closed_at,
    mergedAt: pr.merged_at
  }));
};

export const fetchIssues = async (token, owner, repo, perPage = 100) => {
  const api = githubApi(token);
  const { data } = await api.get(`/repos/${owner}/${repo}/issues`, {
    params: { state: 'all', per_page: perPage }
  });

  // Filter out PRs (GitHub returns them mixed into the issues endpoint)
  return data
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      githubId: issue.id,
      number: issue.number,
      title: issue.title,
      state: issue.state,
      createdAt: issue.created_at,
      closedAt: issue.closed_at
    }));
};