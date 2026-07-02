import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInsights, regenerateInsights } from '../services/insightService';

const typeStyles = {
  positive: { border: 'border-signal-green/30', dot: 'bg-signal-green' },
  negative: { border: 'border-signal-red/30', dot: 'bg-signal-red' },
  neutral: { border: 'border-pulse/30', dot: 'bg-pulse' }
};

const InsightsPanel = ({ repoId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['insights', repoId],
    queryFn: () => getInsights(repoId)
  });

  const regenerate = useMutation({
    mutationFn: () => regenerateInsights(repoId),
    onSuccess: (result) => {
      queryClient.setQueryData(['insights', repoId], result);
    }
  });

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-display text-lg text-bone">AI insights</p>
          {data?.generatedAt && (
            <p className="text-xs text-muted font-mono">
              Generated {new Date(data.generatedAt).toLocaleString()}
              {data.cached && ' (cached)'}
            </p>
          )}
        </div>
        <button
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="px-3 py-1.5 rounded-lg bg-ink border border-white/10 text-sm text-bone hover:border-pulse/40 disabled:opacity-50"
        >
          {regenerate.isPending ? 'Thinking...' : 'Regenerate'}
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted text-sm font-mono">Generating insights...</p>
      ) : (
        <div className="space-y-3">
          {data.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`border ${typeStyles[insight.type]?.border || typeStyles.neutral.border} rounded-lg p-3 flex gap-3`}
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${typeStyles[insight.type]?.dot || typeStyles.neutral.dot}`} />
              <div>
                <p className="text-bone text-sm font-medium">{insight.title}</p>
                <p className="text-muted text-sm mt-0.5">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;