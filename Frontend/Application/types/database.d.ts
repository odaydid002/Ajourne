export interface Device {
  id: string;
  created_at: string;
}

export interface Publisher {
  id: string;
  device_id?: string;
  name: string;
  email: string;
  email_verified: number;
  created_at: string;
  verified_at?: string;
}

export interface Calculator {
  id: string;
  publisher_id?: string;
  device_id?: string;
  type: 'simple' | 'advanced';
  title: string;
  description?: string;
  published: number;
  ratings_count: number;
  ratings_avg: number;
  usage_count: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  synced: number;
}

export interface Semester {
  id: string;
  calculator_id: string;
  name: 's1' | 's2';
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  synced: number;
}

export interface Unit {
  id: string;
  semester_id: string;
  title: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  synced: number;
}

export interface Module {
  id: string;
  semester_id?: string;
  unit_id?: string;
  name: string;
  coeff: number;
  has_td: number;
  has_tp: number;
  credit?: number;
  weight_exam?: number;
  weight_td?: number;
  weight_tp?: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  synced: number;
}

export interface CalculatorRating {
  id: string;
  calculator_id: string;
  device_id: string;
  rating: number;
  created_at: string;
  updated_at?: string;
  synced: number;
}

export interface CalculatorUsage {
  calculator_id: string;
  device_id: string;
  first_used_at: string;
}
