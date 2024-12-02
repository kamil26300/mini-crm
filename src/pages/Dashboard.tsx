import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Send, AlertTriangle } from 'lucide-react';
import { dashboardApi } from '../services/api';

// Define a type for the dashboard stats
interface DashboardStats {
  totalCustomers: number;
  completedCampaigns: number;
  messageSuccessRate: number;
  failedDeliveries: number;
}

// Define a type for each dashboard item
interface DashboardItem {
  name: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number }>;
  change: string;
  changeType: 'positive' | 'negative';
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const data = await dashboardApi.getStats();
        setStats(data.data)
      } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        setError(error.message)
      } finally {
        setLoading(false)
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Mapping the stats to dashboard items
  const dashboardItems: DashboardItem[] = [
    {
      name: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
    },
    {
      name: 'Completed Campaigns',
      value: stats?.completedCampaigns ?? 0,
      icon: Send,
    },
    {
      name: 'Message Success Rate',
      value: `${stats?.messageSuccessRate ?? 0}%`,
      icon: BarChart3,

    },
    {
      name: 'Failed Deliveries',
      value: stats?.failedDeliveries ?? 0,
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardItems.map(({ name, value, icon: Icon, change, changeType }) => (
          <div
            key={name}
            className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="text-sm font-medium text-gray-600">{name}</h2>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p
                className={`text-sm ${
                  changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change}
              </p>
            </div>
            <div className="text-indigo-500">
              <Icon size={36} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
