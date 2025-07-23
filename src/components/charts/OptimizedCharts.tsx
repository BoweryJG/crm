import React, { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ChartProps {
  data: any[];
  height?: number;
  loading?: boolean;
}

// Optimized Tooltip component
const OptimizedTooltip = memo(({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '2px 0', color: entry.color }}>
            {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

OptimizedTooltip.displayName = 'OptimizedTooltip';

// Performance-optimized Bar Chart
export const OptimizedBarChart = memo<ChartProps & { 
  xKey: string; 
  yKeys: { key: string; name: string; color?: string }[];
  yAxisId?: string;
}>(({ data, height = 300, xKey, yKeys, yAxisId }) => {
  const memoizedData = useMemo(() => data, [data]);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={memoizedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          yAxisId={yAxisId || "left"}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <OptimizedTooltip />
        <Legend />
        {yKeys.map((yKey, index) => (
          <Bar
            key={yKey.key}
            yAxisId={yAxisId || "left"}
            dataKey={yKey.key}
            fill={yKey.color || COLORS[index % COLORS.length]}
            name={yKey.name}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
});

OptimizedBarChart.displayName = 'OptimizedBarChart';

// Performance-optimized Line Chart
export const OptimizedLineChart = memo<ChartProps & {
  xKey: string;
  lines: { key: string; name: string; color?: string }[];
}>(({ data, height = 300, xKey, lines }) => {
  const memoizedData = useMemo(() => data, [data]);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={memoizedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <OptimizedTooltip />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color || COLORS[index % COLORS.length]}
            name={line.name}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
});

OptimizedLineChart.displayName = 'OptimizedLineChart';

// Performance-optimized Pie Chart
export const OptimizedPieChart = memo<ChartProps & {
  nameKey: string;
  valueKey: string;
  showLabels?: boolean;
  formatter?: (value: any) => string;
}>(({ data, height = 300, nameKey, valueKey, showLabels = true, formatter }) => {
  const memoizedData = useMemo(() => data, [data]);
  
  const renderCustomizedLabel = useMemo(() => {
    if (!showLabels) return false;
    
    return ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      if (percent < 0.05) return null; // Don't show labels for slices < 5%

      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize={12}
          fontWeight={600}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
  }, [showLabels]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={memoizedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={Math.min(height * 0.35, 120)}
          fill="#8884d8"
          dataKey={valueKey}
        >
          {memoizedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <OptimizedTooltip formatter={formatter} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
});

OptimizedPieChart.displayName = 'OptimizedPieChart';

// Performance-optimized Radar Chart
export const OptimizedRadarChart = memo<ChartProps & {
  radars: { key: string; name: string; color?: string }[];
  angleKey: string;
}>(({ data, height = 300, radars, angleKey }) => {
  const memoizedData = useMemo(() => data, [data]);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={memoizedData}>
        <PolarGrid stroke="#f0f0f0" />
        <PolarAngleAxis dataKey={angleKey} tick={{ fontSize: 12 }} />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fontSize: 10 }}
          tickCount={5}
        />
        <OptimizedTooltip />
        <Legend />
        {radars.map((radar, index) => (
          <Radar
            key={radar.key}
            name={radar.name}
            dataKey={radar.key}
            stroke={radar.color || COLORS[index % COLORS.length]}
            fill={radar.color || COLORS[index % COLORS.length]}
            fillOpacity={0.6}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
});

OptimizedRadarChart.displayName = 'OptimizedRadarChart';

// Chart Loading Skeleton
export const ChartSkeleton = memo<{ height?: number }>(({ height = 300 }) => (
  <div
    style={{
      width: '100%',
      height,
      background: 'linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
      borderRadius: '8px'
    }}
  />
));

ChartSkeleton.displayName = 'ChartSkeleton';

// Add shimmer animation to global styles
const shimmerStyles = `
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('chart-shimmer-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'chart-shimmer-styles';
  styleSheet.innerText = shimmerStyles;
  document.head.appendChild(styleSheet);
}