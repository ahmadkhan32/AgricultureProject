import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProducerStats = ({ stats }) => {
  // Mock data for demonstration
  const businessTypeData = [
    { name: 'Agriculture', value: 45, color: '#3B82F6' },
    { name: 'Livestock', value: 30, color: '#10B981' },
    { name: 'Fisheries', value: 20, color: '#8B5CF6' },
    { name: 'Mixed', value: 5, color: '#F59E0B' },
  ];

  const regionData = [
    { name: 'Grande Comore', producers: 120, pending: 15 },
    { name: 'Anjouan', producers: 85, pending: 8 },
    { name: 'Mohéli', producers: 45, pending: 5 },
  ];

  const monthlyRegistrations = [
    { month: 'Jan', registrations: 12 },
    { month: 'Feb', registrations: 18 },
    { month: 'Mar', registrations: 15 },
    { month: 'Apr', registrations: 22 },
    { month: 'May', registrations: 28 },
    { month: 'Jun', registrations: 25 },
  ];


  return (
    <div className="space-y-6">
      {/* Business Type Distribution */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Business Type Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={businessTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {businessTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Distribution */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Regional Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="producers" fill="#3B82F6" name="Approved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Registrations */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Registrations</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="registrations" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-blue-900">Total Producers</h5>
          <p className="text-2xl font-bold text-blue-600">250</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-900">Pending Approval</h5>
          <p className="text-2xl font-bold text-yellow-600">28</p>
        </div>
      </div>
    </div>
  );
};

export default ProducerStats;