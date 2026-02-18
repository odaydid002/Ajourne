import { apiRequest } from './api.config';

export interface Module {
  id: string;
  semester_id: string;
  unit_id?: string;
  name: string;
  coeff: number;
  has_td: boolean;
  has_tp: boolean;
  credit?: number;
  weight_exam?: number;
  weight_td?: number;
  weight_tp?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const moduleService = {
  /**
   * Create a new module
   */
  createModule: async (data: Omit<Module, 'id' | 'created_at' | 'updated_at'>): Promise<Module> => {
    return apiRequest('/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get module by ID
   */
  getModule: async (id: string): Promise<Module> => {
    return apiRequest(`/modules/${id}`);
  },

  /**
   * Update module
   */
  updateModule: async (id: string, data: Partial<Module>): Promise<Module> => {
    return apiRequest(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete module (soft delete)
   */
  deleteModule: async (id: string): Promise<Module> => {
    return apiRequest(`/modules/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get modules by semester
   */
  getModulesBySemester: async (semesterId: string): Promise<Module[]> => {
    return apiRequest(`/semesters/${semesterId}/modules`);
  },

  /**
   * Get modules by unit
   */
  getModulesByUnit: async (unitId: string): Promise<Module[]> => {
    return apiRequest(`/units/${unitId}/modules`);
  },
};
