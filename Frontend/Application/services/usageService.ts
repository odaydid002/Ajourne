import { apiRequest } from './api.config';

export interface Usage {
  calculator_id: string;
  device_id: string;
  first_used_at: string;
}

export interface UsageStats {
  total_users: number;
  total_usages: number;
  first_used_at: string;
  last_used_at: string;
}

export const usageService = {
  /**
   * Track calculator usage
   */
  trackUsage: async (data: Omit<Usage, 'first_used_at'>): Promise<Usage> => {
    return apiRequest('/usage', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all usage records for a calculator
   */
  getUsageByCalculator: async (calculatorId: string): Promise<Usage[]> => {
    return apiRequest(`/calculators/${calculatorId}/usage`);
  },

  /**
   * Get usage statistics for a calculator
   */
  getUsageStats: async (calculatorId: string): Promise<UsageStats> => {
    return apiRequest(`/calculators/${calculatorId}/usage/stats`);
  },
};
