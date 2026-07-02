const medalColor = (idx) => {
  if (idx === 0) return 'text-pulse';
  if (idx === 1) return 'text-bone';
  if (idx === 2) return 'text-muted';
  return 'text-muted';
};

const Leaderboard = ({ data }) => {
  if (!data?.length) {
    return <p className="text-muted text-sm">No contributor data yet.</p>;
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <p className="font-display text-lg text-bone mb-4">Developer leaderboard</p>
      <div className="space-y-1">
        {data.slice(0, 10).map((dev, idx) => (
          <div
            key={dev.author}
            className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 py-2 border-b border-white/5 last:border-0"
          >
            <span className={`font-mono text-sm ${medalColor(idx)}`}>#{idx + 1}</span>
            <span className="text-bone text-sm truncate">{dev.author}</span>
            <span className="font-mono text-xs text-muted">{dev.commits} commits</span>
            <span className="font-mono text-xs text-muted w-20 text-right">{dev.totalChurn} lines</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;