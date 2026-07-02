import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { connectRepository } from '../services/repositoryService';

const ConnectRepoForm = () => {
  const [githubToken, setGithubToken] = useState('');
  const [fullName, setFullName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: connectRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      setFullName('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ githubToken, fullName });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-xl p-6 space-y-4">
      <h2 className="font-display text-lg text-bone">Connect a repository</h2>
      <p className="text-sm text-muted">
        Paste a GitHub Personal Access Token and a repo in{' '}
        <span className="font-mono text-pulse">owner/repo</span> format.
      </p>

      <input
        type="password"
        placeholder="GitHub Personal Access Token"
        value={githubToken}
        onChange={(e) => setGithubToken(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-ink text-bone border border-white/10 focus:outline-none focus:border-pulse font-mono text-sm"
        required
      />
      <input
        type="text"
        placeholder="e.g. facebook/react"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-ink text-bone border border-white/10 focus:outline-none focus:border-pulse font-mono text-sm"
        required
      />

      {mutation.isError && (
        <p className="text-signal-red text-sm">
          {mutation.error.response?.data?.message || 'Failed to connect repository'}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2 rounded-lg bg-pulse hover:bg-pulse/90 text-ink font-medium disabled:opacity-50"
      >
        {mutation.isPending ? 'Syncing repository data...' : 'Connect repository'}
      </button>
    </form>
  );
};

export default ConnectRepoForm;