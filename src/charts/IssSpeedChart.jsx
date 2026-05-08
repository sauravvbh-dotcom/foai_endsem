import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateSpeed } from '../utils/haversine';
import { format } from 'date-fns';

export default function IssSpeedChart({ positions }) {
  const data = useMemo(() => {
    if (!positions || positions.length < 2) return [];
    const chartData = [];
    
    // We start from index 1 because speed requires 2 points
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      const pos1 = { lat: prev.latitude, lng: prev.longitude };
      const pos2 = { lat: curr.latitude, lng: curr.longitude };
      const timeDiff = Math.abs(curr.timestamp - prev.timestamp);
      
      let speed = 0;
      if (timeDiff > 0) {
        speed = calculateSpeed(pos1, pos2, timeDiff);
      }
      
      chartData.push({
        time: format(new Date(curr.timestamp * 1000), 'HH:mm:ss'),
        speed: Math.round(speed),
      });
    }
    return chartData;
  }, [positions]);

  if (data.length === 0) {
    return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground border rounded-lg bg-card">Gathering speed data...</div>;
  }

  return (
    <div className="h-[300px] w-full bg-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4">Speed History (km/h)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
          <XAxis dataKey="time" stroke="hsl(var(--foreground))" fontSize={12} tickMargin={10} angle={-45} textAnchor="end" height={60} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }}
            itemStyle={{ color: '#ef4444' }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line name="ISS Speed (km/h)" type="monotone" dataKey="speed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
