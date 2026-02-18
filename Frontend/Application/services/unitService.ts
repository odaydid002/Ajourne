import { apiRequest } from './api.config';

export interface Unit {
  id: string;
  semester_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const unitService = {
  /**
   * Create a new unit
   */
  createUnit: async (data: Omit<Unit, 'id' | 'created_at' | 'updated_at'>): Promise<Unit> => {
    return apiRequest('/units', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get unit by ID
   */
  getUnit: async (id: string): Promise<Unit> => {
    return apiRequest(`/units/${id}`);
  },

  /**
   * Update unit
   */
  updateUnit: async (id: string, data: Partial<Unit>): Promise<Unit> => {
    return apiRequest(`/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete unit (soft delete)
   */
  deleteUnit: async (id: string): Promise<Unit> => {
    return apiRequest(`/units/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get units by semester
   */
  getUnitsBySemester: async (semesterId: string): Promise<Unit[]> => {
    return apiRequest(`/semesters/${semesterId}/units`);
  },
};
