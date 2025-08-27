import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const ProductivityChart = ({ data }) => {
  if (!data) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded"></div>;
  }

  const { tasksByStatus, tasksByPriority } = data;

  // Prepare data for status pie chart - ALWAYS show all statuses
  const statusData = [
    { name: 'To Do', value: tasksByStatus.todo || 0, color: '#EF4444' }, // Red for incomplete
    { name: 'In Progress', value: tasksByStatus['in-progress'] || 0, color: '#F59E0B' }, // Orange for in progress
    { name: 'Completed', value: tasksByStatus.completed || 0, color: '#10B981' } // Green for completed
  ]; // Remove the filter so all statuses show even with 0 values

  // Prepare data for priority bar chart
  const priorityData = [
    { name: 'Low', value: tasksByPriority.low || 0, color: '#6B7280' },
    { name: 'Medium', value: tasksByPriority.medium || 0, color: '#F59E0B' },
    { name: 'High', value: tasksByPriority.high || 0, color: '#EF4444' }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    // Only show percentage if there are actual tasks (value > 0)
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Check if there are any tasks at all
  const hasAnyTasks = statusData.some(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Task Status Pie Chart */}
      {hasAnyTasks && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Task Status Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Priority Bar Chart */}
      {priorityData.some(item => item.value > 0) && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tasks by Priority</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Tasks']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#F9FAFB', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[2, 2, 0, 0]}
                  fill={(entry) => entry.color}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasAnyTasks && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm">No task data to display</p>
          <p className="text-xs text-gray-400">Create some tasks to see your productivity charts</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityChart; 