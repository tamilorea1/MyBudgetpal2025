'use client'
import {Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsChartPage({data}) {
  //SAFETY CHECK:
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', borderRadius: '12px', color: '#64748b' }}>
        <p>No expense data available for this category.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
      <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
                <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                >
                    {/* Now this .map is safe because of the check above */}
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign='bottom' height={36}/>
            </PieChart>
      </ResponsiveContainer>
    </div>
  )
}