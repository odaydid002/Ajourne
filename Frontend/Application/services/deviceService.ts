import { apiRequest } from './api.config';

export interface Device {
  id: string;
  name?: string;
  age?: number;
  speciality?: string;
  level?: string;
  university?: string;
  created_at: string;
}

export const deviceService = {
  /**
   * Create a new device
   */
  createDevice: async (data: Partial<Device>): Promise<Device> => {
    return apiRequest('/devices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get device by ID
   */
  getDevice: async (id: string): Promise<Device> => {
    return apiRequest(`/devices/${id}`);
  },

  /**
   * Get or create device
   */
  getOrCreateDevice: async (data: Partial<Device>): Promise<Device> => {
    return apiRequest('/devices/or-create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
