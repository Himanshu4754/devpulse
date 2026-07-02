import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getRepositories, refreshRepository } from '../services/repositoryService';

const RepositoryList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: repositories, isLoading, isError } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories
  });

  const refreshMutation = useMutation({
    mutationFn: refreshRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    }
  });

  if (isLoading) {
    return <p className="text-muted font-mono text-sm">Loading repositories...</p>;
  }

  if (isError) {
    return <p className="text-signal-red text-sm">Could not load repositories.</p>;
  }

  if (!repositories?.length) {
    return (
      <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
        <p className="text-muted">No repositories connected yet. Add one above to see your first metrics.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {repositories.map((repo) => (
        <div
          key={repo._id}
          className="bg-surface border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-pulse/40 transition-colors cursor-pointer"
          onClick={() => navigate(`/repositories/${repo._id}`)}
        >
          <div>
            <h3 className="font-display text-bone">{repo.fullName}</h3>
            <p className="text-sm text-muted">{repo.description || 'No description'}</p>
            <p className="text-xs text-muted font-mono mt-1">
              {repo.lastSyncedAt
                ? `Synced ${new Date(repo.lastSyncedAt).toLocaleString()}`
                : 'Not synced yet'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              refreshMutation.mutate(repo._id);
            }}
            disabled={refreshMutation.isPending}
            className="px-3 py-1.5 rounded-lg bg-ink border border-white/10 text-sm text-bone hover:border-pulse/40 disabled:opacity-50"
          >
            {refreshMutation.isPending ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RepositoryList;