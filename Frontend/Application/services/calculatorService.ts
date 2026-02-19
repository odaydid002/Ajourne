import { apiRequest } from './api.config';

export interface Calculator {
  id: string;
  publisher_id?: string;
  device_id?: string;
  type: 'simple' | 'advanced';
  title: string;
  description?: string;
  published: boolean;
  speciality?: string;
  level?: string;
  university_name?: string;
  ratings_count: number;
  ratings_avg: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const calculatorService = {
  /**
   * Create a new calculator
   */
  createCalculator: async (data: Omit<Calculator, 'id' | 'created_at' | 'updated_at'>): Promise<Calculator> => {
    return apiRequest('/calculators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all published calculators
   */
  getPublishedCalculators: async (filters?: {
    speciality?: string;
    level?: string;
    university?: string;
  }): Promise<Calculator[]> => {
    const query = new URLSearchParams(filters as any).toString();
    return apiRequest(`/calculators${query ? '?' + query : ''}`);
  },

  /**
   * Search calculators
   */
  searchCalculators: async (query: string): Promise<Calculator[]> => {
    return apiRequest(`/calculators/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get calculator by ID
   */
  getCalculator: async (id: string): Promise<Calculator> => {
    const res = await apiRequest(`/calculators/${id}`);
    // Unwrap common API wrappers
    if (res && typeof res === 'object') {
      if (res.data) return res.data;
      if (res.calculator) return res.calculator;
    }
    return res as Calculator;
  },

  /**
   * Update calculator
   */
  updateCalculator: async (id: string, data: Partial<Calculator>): Promise<Calculator> => {
    return apiRequest(`/calculators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete calculator (soft delete)
   */
  deleteCalculator: async (id: string): Promise<Calculator> => {
    return apiRequest(`/calculators/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Publish calculator
   */
  publishCalculator: async (id: string): Promise<Calculator> => {
    return apiRequest(`/calculators/${id}/publish`, {
      method: 'POST',
    });
  },

  /**
   * Get calculators by publisher
   */
  getCalculatorsByPublisher: async (publisherId: string): Promise<Calculator[]> => {
    return apiRequest(`/publishers/${publisherId}/calculators`);
  },

  /**
   * Get calculators by device
   */
  getCalculatorsByDevice: async (deviceId: string): Promise<Calculator[]> => {
    return apiRequest(`/devices/${deviceId}/calculators`);
  },

  /**
   * Create calculator with full structure (all-in-one) for publisher
   */
  createCalculatorAllInOne: async (
    publisherId: string,
    data: any
  ): Promise<any> => {
    return apiRequest(`/publishers/${publisherId}/calculators/all-in-one`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
