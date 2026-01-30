import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Token, ChartDataPoint } from '../types';

interface MarketChartProps {
  data: ChartDataPoint[];
  token: Token;
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, token }) => {
  const isPositive = token.change24h >= 0;
  const color = isPositive ? '#10b981' : '#ef4444'; // emerald-500 : red-500

  return (
    <div className="w-full h-[300px] mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dx={10}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0'
            }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="absolute top-0 left-0">
        <h3 className="text-3xl font-bold font-mono text-white tracking-tighter">
          ${token.price.toLocaleString()}
        </h3>
        <p className={`flex items-center gap-1 font-mono text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{token.change24h}% (24h)
        </p>
      </div>
    </div>
  );
};
