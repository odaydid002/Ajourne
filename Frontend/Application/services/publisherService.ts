import { apiRequest } from './api.config';

export interface Publisher {
  id: string;
  device_id?: string;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  verified_at?: string;
}

export const publisherService = {
  /**
   * Register a new publisher
   */
  registerPublisher: async (data: Omit<Publisher, 'id' | 'created_at'>): Promise<Publisher> => {
    return apiRequest('/publishers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all publishers
   */
  getAllPublishers: async (): Promise<Publisher[]> => {
    return apiRequest('/publishers');
  },

  /**
   * Get publisher by ID
   */
  getPublisher: async (id: string): Promise<Publisher> => {
    return apiRequest(`/publishers/${id}`);
  },

  /**
   * Update publisher
   */
  updatePublisher: async (id: string, data: Partial<Publisher>): Promise<Publisher> => {
    return apiRequest(`/publishers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify publisher email
   */
  verifyEmail: async (id: string): Promise<Publisher> => {
    return apiRequest(`/publishers/${id}/verify-email`, {
      method: 'POST',
    });
  },
};
