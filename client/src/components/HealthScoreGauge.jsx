const scoreColor = (score) => {
  if (score >= 70) return 'text-signal-green';
  if (score >= 40) return 'text-pulse';
  return 'text-signal-red';
};

const HealthScoreGauge = ({ healthScore }) => {
  const { score, breakdown } = healthScore;

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <p className="text-muted text-xs uppercase tracking-wide font-mono mb-2">
        Engineering health score
      </p>
      <p className={`font-display text-5xl ${scoreColor(score)}`}>{score}</p>
      <p className="text-muted text-sm mb-4">out of 100</p>

      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono w-32 shrink-0">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
            <div className="flex-1 h-1.5 bg-ink rounded-full overflow-hidden">
              <div
                className="h-full bg-pulse rounded-full"
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthScoreGauge;