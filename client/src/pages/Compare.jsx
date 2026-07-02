import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRepositories } from '../services/repositoryService';
import { compareRepositories } from '../services/comparisonService';

const scoreColor = (score) => {
  if (score >= 70) return 'text-signal-green';
  if (score >= 40) return 'text-pulse';
  return 'text-signal-red';
};

const CompareRow = ({ label, valueA, valueB, betterIsLower = false }) => {
  const a = parseFloat(valueA);
  const b = parseFloat(valueB);
  const aWins = betterIsLower ? a < b : a > b;
  const bWins = betterIsLower ? b < a : b > a;

  return (
    <div className="grid grid-cols-3 items-center py-3 border-b border-white/5 last:border-0">
      <span className={`font-mono text-sm ${aWins ? 'text-signal-green' : 'text-bone'}`}>{valueA}</span>
      <span className="text-muted text-xs uppercase tracking-wide text-center">{label}</span>
      <span className={`font-mono text-sm text-right ${bWins ? 'text-signal-green' : 'text-bone'}`}>{valueB}</span>
    </div>
  );
};

const Compare = () => {
  const [repoIdA, setRepoIdA] = useState('');
  const [repoIdB, setRepoIdB] = useState('');

  const { data: repositories } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories
  });

  const { data: comparison, isLoading, isError } = useQuery({
    queryKey: ['compare', repoIdA, repoIdB],
    queryFn: () => compareRepositories(repoIdA, repoIdB),
    enabled: !!repoIdA && !!repoIdB && repoIdA !== repoIdB
  });

  const selectClass =
    'w-full px-3 py-2 rounded-lg bg-surface text-bone border border-white/10 focus:outline-none focus:border-pulse font-mono text-sm';

  return (
    <div className="min-h-screen bg-ink text-bone p-8">
      <Link to="/dashboard" className="text-pulse text-sm">&larr; Back to dashboard</Link>
      <h1 className="font-display text-2xl mt-4 mb-6">Compare repositories</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl">
        <select value={repoIdA} onChange={(e) => setRepoIdA(e.target.value)} className={selectClass}>
          <option value="">Select repository A</option>
          {repositories?.map((r) => (
            <option key={r._id} value={r._id}>{r.fullName}</option>
          ))}
        </select>
        <select value={repoIdB} onChange={(e) => setRepoIdB(e.target.value)} className={selectClass}>
          <option value="">Select repository B</option>
          {repositories?.map((r) => (
            <option key={r._id} value={r._id}>{r.fullName}</option>
          ))}
        </select>
      </div>

      {repoIdA && repoIdB && repoIdA === repoIdB && (
        <p className="text-signal-red text-sm">Select two different repositories to compare.</p>
      )}

      {isLoading && <p className="text-muted font-mono text-sm">Comparing...</p>}
      {isError && <p className="text-signal-red text-sm">Could not load comparison.</p>}

      {comparison && (
        <div className="bg-surface border border-white/10 rounded-xl p-6 max-w-2xl">
          <div className="grid grid-cols-3 items-center mb-4 pb-4 border-b border-white/10">
            <p className="font-display text-bone truncate">{comparison.repositories[0].fullName}</p>
            <p className="text-center text-muted text-xs uppercase tracking-wide">Metric</p>
            <p className="font-display text-bone text-right truncate">{comparison.repositories[1].fullName}</p>
          </div>

          <div className="grid grid-cols-3 items-center mb-2">
            <p className={`font-mono text-3xl ${scoreColor(comparison.repositories[0].metrics.healthScore.score)}`}>
              {comparison.repositories[0].metrics.healthScore.score}
            </p>
            <p className="text-center text-muted text-xs">Health Score</p>
            <p className={`font-mono text-3xl text-right ${scoreColor(comparison.repositories[1].metrics.healthScore.score)}`}>
              {comparison.repositories[1].metrics.healthScore.score}
            </p>
          </div>

          <div className="mt-4">
            <CompareRow
              label="Commits/day"
              valueA={comparison.repositories[0].metrics.commitFrequency.commitsPerDay}
              valueB={comparison.repositories[1].metrics.commitFrequency.commitsPerDay}
            />
            <CompareRow
              label="PR merge time (h)"
              valueA={comparison.repositories[0].metrics.prMergeTime.avgMergeTimeHours}
              valueB={comparison.repositories[1].metrics.prMergeTime.avgMergeTimeHours}
              betterIsLower
            />
            <CompareRow
              label="Issue resolution (h)"
              valueA={comparison.repositories[0].metrics.issueResolution.avgResolutionTimeHours}
              valueB={comparison.repositories[1].metrics.issueResolution.avgResolutionTimeHours}
              betterIsLower
            />
            <CompareRow
              label="Churn/commit"
              valueA={comparison.repositories[0].metrics.codeChurn.avgChurnPerCommit}
              valueB={comparison.repositories[1].metrics.codeChurn.avgChurnPerCommit}
              betterIsLower
            />
            <CompareRow
              label="Contributors"
              valueA={comparison.repositories[0].metrics.contributors.count}
              valueB={comparison.repositories[1].metrics.contributors.count}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;