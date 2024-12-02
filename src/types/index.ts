export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpending: number;
  lastVisit: Date;
  visitCount: number;
}

export interface DashboardStats {
  totalCustomers: number;
  completedCampaigns: number;
  messageSuccessRate: number;
  failedDeliveries: number;
}

export interface Campaign {
  _id: string;
  name: string;
  audienceSize: number;
  conditions: AudienceCondition[];
  messageTemplate: string;
  status: 'draft' | 'running' | 'completed';
  stats: {
    sent: number;
    failed: number;
  };
  createdAt: Date;
}

export interface AudienceCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number | string | Date;
  conjunction: 'AND' | 'OR';
}