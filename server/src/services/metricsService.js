import Commit from '../models/Commit.js';
import PullRequest from '../models/PullRequest.js';
import Issue from '../models/Issue.js';

const hoursBetween = (a, b) => (new Date(b) - new Date(a)) / (1000 * 60 * 60);

const average = (nums) =>
  nums.length ? nums.reduce((sum, n) => sum + n, 0) / nums.length : 0;

const calculateCommitFrequency = (commits) => {
  if (commits.length < 2) return { commitsPerDay: commits.length, totalCommits: commits.length };

  const dates = commits.map((c) => new Date(c.committedAt).getTime());
  const spanDays = (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24) || 1;

  return {
    commitsPerDay: Number((commits.length / spanDays).toFixed(2)),
    totalCommits: commits.length
  };
};

const calculatePRMergeTime = (pullRequests) => {
  const mergedPRs = pullRequests.filter((pr) => pr.merged && pr.mergedAt);
  const mergeTimes = mergedPRs.map((pr) => hoursBetween(pr.createdAt, pr.mergedAt));

  return {
    avgMergeTimeHours: Number(average(mergeTimes).toFixed(1)),
    mergedCount: mergedPRs.length,
    openCount: pullRequests.filter((pr) => pr.state === 'open').length
  };
};

const calculateIssueResolutionTime = (issues) => {
  const closedIssues = issues.filter((i) => i.state === 'closed' && i.closedAt);
  const resolutionTimes = closedIssues.map((i) => hoursBetween(i.createdAt, i.closedAt));

  return {
    avgResolutionTimeHours: Number(average(resolutionTimes).toFixed(1)),
    closedCount: closedIssues.length,
    openCount: issues.filter((i) => i.state === 'open').length
  };
};

const calculateCodeChurn = (commits) => {
  const changesPerCommit = commits.map((c) => c.additions + c.deletions);
  return {
    avgChurnPerCommit: Number(average(changesPerCommit).toFixed(0)),
    totalAdditions: commits.reduce((sum, c) => sum + c.additions, 0),
    totalDeletions: commits.reduce((sum, c) => sum + c.deletions, 0)
  };
};

const calculateContributors = (commits) => {
  const authors = new Set(commits.map((c) => c.author));
  return { count: authors.size, names: Array.from(authors) };
};

// Normalizes a raw value against a "good" benchmark into a 0-100 sub-score.
// lowerIsBetter=true means smaller raw values score higher (e.g. merge time).
const normalize = (value, benchmark, lowerIsBetter = false) => {
  if (value === 0 && !lowerIsBetter) return 0;
  const ratio = lowerIsBetter ? benchmark / (value || benchmark) : value / benchmark;
  return Math.max(0, Math.min(100, ratio * 100));
};

const calculateHealthScore = ({ prMetrics, issueMetrics, commitMetrics, churnMetrics }) => {
  const mergeScore = normalize(prMetrics.avgMergeTimeHours, 48, true); // benchmark: 48hrs
  const resolutionScore = normalize(issueMetrics.avgResolutionTimeHours, 168, true); // benchmark: 7 days
  const frequencyScore = normalize(commitMetrics.commitsPerDay, 1); // benchmark: 1 commit/day
  const churnScore = normalize(churnMetrics.avgChurnPerCommit, 200, true); // benchmark: 200 lines/commit

  const weighted =
    mergeScore * 0.3 + resolutionScore * 0.25 + frequencyScore * 0.25 + churnScore * 0.2;

  return {
    score: Math.round(weighted),
    breakdown: {
      prMergeTime: Math.round(mergeScore),
      issueResolution: Math.round(resolutionScore),
      commitFrequency: Math.round(frequencyScore),
      codeChurn: Math.round(churnScore)
    }
  };
};

const calculateCommitTrend = (commits) => {
  // Bucket commits by day, last 30 days of activity present in the data
  const buckets = {};
  commits.forEach((c) => {
    const day = new Date(c.committedAt).toISOString().split('T')[0];
    buckets[day] = (buckets[day] || 0) + 1;
  });

  return Object.entries(buckets)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-30)
    .map(([date, count]) => ({ date, commits: count }));
};

const calculatePRMergeTrend = (pullRequests) => {
  // Bucket merged PRs by week, average merge time per week
  const merged = pullRequests.filter((pr) => pr.merged && pr.mergedAt);
  const buckets = {};

  merged.forEach((pr) => {
    const weekStart = new Date(pr.mergedAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // start of week
    const key = weekStart.toISOString().split('T')[0];
    const hours = hoursBetween(pr.createdAt, pr.mergedAt);

    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(hours);
  });

  return Object.entries(buckets)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([week, hoursArr]) => ({
      week,
      avgMergeHours: Number(average(hoursArr).toFixed(1))
    }));
};

const calculateLeaderboard = (commits) => {
  const stats = {};

  commits.forEach((c) => {
    if (!stats[c.author]) {
      stats[c.author] = { author: c.author, commits: 0, additions: 0, deletions: 0 };
    }
    stats[c.author].commits += 1;
    stats[c.author].additions += c.additions;
    stats[c.author].deletions += c.deletions;
  });

  return Object.values(stats)
    .map((s) => ({ ...s, totalChurn: s.additions + s.deletions }))
    .sort((a, b) => b.commits - a.commits);
};

const calculateContributorBreakdown = (commits) => {
  const counts = {};
  commits.forEach((c) => {
    counts[c.author] = (counts[c.author] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8) // top 8 — keeps the chart readable
    .map(([author, commits]) => ({ author, commits }));
};

export const computeRepositoryMetrics = async (repositoryId) => {
  const [commits, pullRequests, issues] = await Promise.all([
    Commit.find({ repository: repositoryId }).lean(),
    PullRequest.find({ repository: repositoryId }).lean(),
    Issue.find({ repository: repositoryId }).lean()
  ]);

  const commitMetrics = calculateCommitFrequency(commits);
  const prMetrics = calculatePRMergeTime(pullRequests);
  const issueMetrics = calculateIssueResolutionTime(issues);
  const churnMetrics = calculateCodeChurn(commits);
  const contributors = calculateContributors(commits);
  const healthScore = calculateHealthScore({ prMetrics, issueMetrics, commitMetrics, churnMetrics });

const trends = {
  commitTrend: calculateCommitTrend(commits),
  prMergeTrend: calculatePRMergeTrend(pullRequests),
  contributorBreakdown: calculateContributorBreakdown(commits),
  leaderboard: calculateLeaderboard(commits)
};

  return {
    commitFrequency: commitMetrics,
    prMergeTime: prMetrics,
    issueResolution: issueMetrics,
    codeChurn: churnMetrics,
    contributors,
    healthScore,
    trends,
    computedAt: new Date()
  };
};