'use client';

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';

const data = [
  { month: 'Sep', current: 150000, average: 100000, shaded: 150000 },
  { month: 'Oct', current: 5000, average: 100000, shaded: 5000 },
  { month: 'Nov', current: 470000, average: 100000, shaded: 470000 },
  { month: 'Dec', current: 280000, average: 100000, shaded: 280000 },
  { month: 'Jan', current: 150000, average: 100000, shaded: 150000 },
  { month: 'Feb', current: 5000, average: 100000, shaded: 5000 },
  { month: 'Mar', current: 80000, average: 100000, shaded: 80000 },
  { month: 'Apr', current: 30000, average: 100000, shaded: 30000 },
  { month: 'May', current: 20000, average: 100000, shaded: 20000 },
  { month: 'Jun', current: 15000, average: 100000, shaded: 15000 },
  { month: 'Jul', current: 10000, average: 100000, shaded: 10000 },
  { month: 'Aug', current: 5000, average: 100000, shaded: 5000 },
  { month: 'Sep', current: 10000, average: 100000, shaded: 10000 },
];

export function BurnRateChart() {
  return (
    <div className="w-full bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Monthly Burn Rate</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-sm" />
            <span className="text-gray-700 font-medium">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-sm relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 border-t-2 border-dashed border-gray-600"></div>
              </div>
            </div>
            <span className="text-gray-700 font-medium">Average</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 10 }}>
            <defs>
              {/* Soft background for the area */}
              <linearGradient id="shadedAreaBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d1d5db" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#d1d5db" stopOpacity={0.1} />
              </linearGradient>
              {/* Diagonal hatch lines inside the area */}
              <pattern id="shadedHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                <rect width="8" height="8" fill="transparent" />
                <path d="M-2 6 L6 -2 M0 8 L8 0 M2 10 L10 2" stroke="#bfc5ce" strokeWidth="1" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#374151', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#374151', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
              domain={[0, 600000]}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#111827',
                padding: '6px 10px',
              }}
              formatter={(value: number) => [`${value.toLocaleString()} kr`, '']}
            />
            {/* Shaded area background */}
            <Area
              type="monotone"
              dataKey="shaded"
              stroke="none"
              fill="url(#shadedAreaBg)"
              isAnimationActive={false}
            />
            {/* Hatch overlay for lines inside the area */}
            <Area
              type="monotone"
              dataKey="shaded"
              stroke="none"
              fill="url(#shadedHatch)"
              fillOpacity={0.6}
              isAnimationActive={false}
            />
            {/* Average line - dashed */}
            <Line
              type="monotone"
              dataKey="average"
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="5 3"
              dot={false}
              isAnimationActive={false}
            />
            {/* Current line - solid with dots */}
            <Line
              type="monotone"
              dataKey="current"
              stroke="#000000"
              strokeWidth={1.5}
              dot={{ fill: '#000000', r: 3.5, strokeWidth: 1.5, stroke: '#ffffff' }}
              activeDot={{ r: 4.5, fill: '#000000', stroke: '#ffffff', strokeWidth: 1.5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}