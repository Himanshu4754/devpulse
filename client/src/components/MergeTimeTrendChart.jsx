import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MergeTimeTrendChart = ({ data }) => {
  if (!data?.length) {
    return <p className="text-muted text-sm">No merged pull requests yet.</p>;
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <p className="font-display text-lg text-bone mb-4">PR merge time (weekly avg)</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="mergeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis
            dataKey="week"
            stroke="#7A8194"
            fontSize={11}
            fontFamily="IBM Plex Mono"
            tickFormatter={(d) => d.slice(5)}
          />
          <YAxis stroke="#7A8194" fontSize={11} fontFamily="IBM Plex Mono" unit="h" />
          <Tooltip
            contentStyle={{ background: '#141924', border: '1px solid #ffffff1a', borderRadius: 8 }}
            labelStyle={{ color: '#E7E4DC', fontFamily: 'IBM Plex Mono' }}
            itemStyle={{ color: '#4ADE80' }}
          />
          <Area type="monotone" dataKey="avgMergeHours" stroke="#4ADE80" fill="url(#mergeGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MergeTimeTrendChart;