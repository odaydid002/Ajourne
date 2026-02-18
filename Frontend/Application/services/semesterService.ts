import { apiRequest } from './api.config';

export interface Semester {
  id: string;
  calculator_id: string;
  name: 's1' | 's2';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const semesterService = {
  /**
   * Create a new semester
   */
  createSemester: async (data: Omit<Semester, 'id' | 'created_at' | 'updated_at'>): Promise<Semester> => {
    return apiRequest('/semesters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get semester by ID
   */
  getSemester: async (id: string): Promise<Semester> => {
    return apiRequest(`/semesters/${id}`);
  },

  /**
   * Update semester
   */
  updateSemester: async (id: string, data: Partial<Semester>): Promise<Semester> => {
    return apiRequest(`/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete semester (soft delete)
   */
  deleteSemester: async (id: string): Promise<Semester> => {
    return apiRequest(`/semesters/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get semesters by calculator
   */
  getSemestersByCalculator: async (calculatorId: string): Promise<Semester[]> => {
    return apiRequest(`/calculators/${calculatorId}/semesters`);
  },
};
