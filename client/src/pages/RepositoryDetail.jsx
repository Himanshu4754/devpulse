import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRepository } from '../services/repositoryService';
import { getRepositoryMetrics } from '../services/metricsService';
import MetricCard from '../components/MetricCard';
import HealthScoreGauge from '../components/HealthScoreGauge';
import CommitTrendChart from '../components/CommitTrendChart';
import MergeTimeTrendChart from '../components/MergeTimeTrendChart';
import ContributorChart from '../components/ContributorChart';
import InsightsPanel from '../components/InsightsPanel';
import Leaderboard from '../components/Leaderboard';

const RepositoryDetail = () => {
  const { id } = useParams();

  const { data: repository, isLoading: repoLoading } = useQuery({
    queryKey: ['repository', id],
    queryFn: () => getRepository(id)
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics', id],
    queryFn: () => getRepositoryMetrics(id)
  });

  if (repoLoading || metricsLoading) {
    return <p className="text-muted font-mono p-8">Computing metrics...</p>;
  }

  return (
    <div className="min-h-screen bg-ink text-bone p-8">
      <Link to="/dashboard" className="text-pulse text-sm">
        &larr; Back to dashboard
      </Link>

      <h1 className="font-display text-2xl mt-4 mb-6">
        {repository?.fullName}
      </h1>

      {/* Health Score + Metric Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <HealthScoreGauge healthScore={metrics.healthScore} />

        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Commit frequency"
            value={`${metrics.commitFrequency.commitsPerDay}/day`}
            sublabel={`${metrics.commitFrequency.totalCommits} total commits`}
          />

          <MetricCard
            label="PR merge time"
            value={`${metrics.prMergeTime.avgMergeTimeHours}h`}
            sublabel={`${metrics.prMergeTime.mergedCount} merged, ${metrics.prMergeTime.openCount} open`}
          />

          <MetricCard
            label="Issue resolution"
            value={`${metrics.issueResolution.avgResolutionTimeHours}h`}
            sublabel={`${metrics.issueResolution.closedCount} closed, ${metrics.issueResolution.openCount} open`}
          />

          <MetricCard
            label="Code churn"
            value={`${metrics.codeChurn.avgChurnPerCommit} lines`}
            sublabel="avg per commit"
          />
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="mb-6">
        <InsightsPanel repoId={id} />
      </div>

      {/* Trend Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <CommitTrendChart data={metrics.trends.commitTrend} />
        <MergeTimeTrendChart data={metrics.trends.prMergeTrend} />
      </div>

      {/* Contributor Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <ContributorChart data={metrics.trends.contributorBreakdown} />
        <Leaderboard data={metrics.trends.leaderboard} />
      </div>
    </div>
  );
};

export default RepositoryDetail;