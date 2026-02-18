import { apiRequest } from './api.config';

export interface Rating {
  id: string;
  calculator_id: string;
  device_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface RatingStats {
  average: number;
  count: number;
  distribution: {
    [key: number]: number;
  };
}

export const ratingService = {
  /**
   * Rate a calculator
   */
  rateCalculator: async (data: Omit<Rating, 'id' | 'created_at' | 'updated_at'>): Promise<Rating> => {
    return apiRequest('/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get rating by ID
   */
  getRating: async (id: string): Promise<Rating> => {
    return apiRequest(`/ratings/${id}`);
  },

  /**
   * Delete rating
   */
  deleteRating: async (id: string): Promise<Rating> => {
    return apiRequest(`/ratings/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all ratings for a calculator
   */
  getRatingsByCalculator: async (calculatorId: string): Promise<Rating[]> => {
    return apiRequest(`/calculators/${calculatorId}/ratings`);
  },

  /**
   * Get rating statistics for a calculator
   */
  getRatingStats: async (calculatorId: string): Promise<RatingStats> => {
    return apiRequest(`/calculators/${calculatorId}/ratings/stats`);
  },

  /**
   * Delete rating by device
   */
  deleteRatingByDevice: async (calculatorId: string, deviceId: string): Promise<Rating> => {
    return apiRequest(`/calculators/${calculatorId}/device/${deviceId}/ratings`, {
      method: 'DELETE',
    });
  },
};
