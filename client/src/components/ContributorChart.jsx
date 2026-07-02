import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ContributorChart = ({ data }) => {
  if (!data?.length) {
    return <p className="text-muted text-sm">No contributor data yet.</p>;
  }

  return (
    <div className="bg-surface border border-white/10 rounded-xl p-6">
      <p className="font-display text-lg text-bone mb-4">Top contributors</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis type="number" stroke="#7A8194" fontSize={11} fontFamily="IBM Plex Mono" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="author"
            stroke="#7A8194"
            fontSize={11}
            fontFamily="IBM Plex Mono"
            width={100}
          />
          <Tooltip
            contentStyle={{ background: '#141924', border: '1px solid #ffffff1a', borderRadius: 8 }}
            labelStyle={{ color: '#E7E4DC', fontFamily: 'IBM Plex Mono' }}
            itemStyle={{ color: '#F4A340' }}
          />
          <Bar dataKey="commits" fill="#F4A340" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributorChart;