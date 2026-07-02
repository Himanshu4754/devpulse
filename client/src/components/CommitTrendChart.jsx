import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CommitTrendChart = ({ data }) => {
  if (!data?.length) {
    return <p className="text-muted text-sm">Not enough commit history to chart yet.</p>;
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <p className="font-display text-lg text-bone mb-4">Commit activity</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis
            dataKey="date"
            stroke="#7A8194"
            fontSize={11}
            fontFamily="IBM Plex Mono"
            tickFormatter={(d) => d.slice(5)}
          />
          <YAxis stroke="#7A8194" fontSize={11} fontFamily="IBM Plex Mono" allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#141924', border: '1px solid #ffffff1a', borderRadius: 8 }}
            labelStyle={{ color: '#E7E4DC', fontFamily: 'IBM Plex Mono' }}
            itemStyle={{ color: '#F4A340' }}
          />
          <Line type="monotone" dataKey="commits" stroke="#F4A340" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommitTrendChart;