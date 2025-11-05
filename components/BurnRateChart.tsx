'use client';

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';

const data = [
  { month: 'Sep', current: 150000, average: 100000, shaded: 150000 },
  { month: 'Oct', current: 5000, average: 100000, shaded: 5000 },
  { month: 'Nov', current: 470000, average: 100000, shaded: 470000 },
  { month: 'Dec', current: 280000, average: 100000, shaded: 280000 },
  { month: 'Jan', current: 150000, average: 100000, shaded: 150000 },
  { month: 'Feb', current: 5000, average: 100000, shaded: 0 },
  { month: 'Mar', current: 80000, average: 100000, shaded: 0 },
  { month: 'Apr', current: 30000, average: 100000, shaded: 0 },
  { month: 'May', current: 20000, average: 100000, shaded: 0 },
  { month: 'Jun', current: 15000, average: 100000, shaded: 0 },
  { month: 'Jul', current: 10000, average: 100000, shaded: 0 },
  { month: 'Aug', current: 5000, average: 100000, shaded: 0 },
  { month: 'Sep', current: 10000, average: 100000, shaded: 0 },
];

export function BurnRateChart() {
  return (
    <div className="w-full bg-white p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Monthly Burn Rate</h3>
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-sm" />
            <span className="text-gray-800 font-semibold text-xs">Current</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-500 border border-gray-400 rounded-sm relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 border-t border-dashed border-gray-600"></div>
              </div>
            </div>
            <span className="text-gray-800 font-semibold text-xs">Average</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '180px', minHeight: '180px', backgroundColor: '#ffffff' }} className="sm:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="shadedArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#111827', fontSize: 11, fontWeight: 600 }}
            dy={10}
            className="text-xs"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#111827', fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
            domain={[0, 600000]}
            dx={-10}
            className="text-xs"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#111827',
            }}
            formatter={(value: number) => [`${value.toLocaleString()} kr`, '']}
          />
          {/* Shaded area from Sep to Jan */}
          <Area
            type="monotone"
            dataKey="shaded"
            stroke="none"
            fill="url(#shadedArea)"
            isAnimationActive={false}
          />
          {/* Average line - thin dashed horizontal */}
          <Line
            type="monotone"
            dataKey="average"
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            isAnimationActive={false}
          />
          {/* Current line - thick with dots */}
          <Line
            type="monotone"
            dataKey="current"
            stroke="#000000"
            strokeWidth={2.5}
            dot={{ fill: '#000000', r: 4, strokeWidth: 1.5, stroke: '#ffffff' }}
            activeDot={{ r: 5, fill: '#000000', stroke: '#ffffff', strokeWidth: 1.5 }}
            isAnimationActive={false}
          />
        </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
