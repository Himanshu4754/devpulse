const MetricCard = ({ label, value, sublabel }) => (
  <div className="bg-surface border border-white/10 rounded-xl p-4">
    <p className="text-muted text-xs uppercase tracking-wide font-mono">{label}</p>
    <p className="font-mono text-2xl text-bone mt-1">{value}</p>
    {sublabel && <p className="text-muted text-xs mt-1">{sublabel}</p>}
  </div>
);

export default MetricCard;