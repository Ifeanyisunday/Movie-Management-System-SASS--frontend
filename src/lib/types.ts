// ==========================================
// NaijaReels – Shared TypeScript Types
// ==========================================

export type UserRole = "admin" | "vendor" | "customer";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: UserRole; 
  is_staff: boolean;
}


export interface AuthTokens {
  access: string;
  refresh: string;
}


export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year?: number;
  daily_rate: number;
  price: number
}

export interface Rental {
  id: number;
  movie_title: string;
  user_username: string;
  rented_at: string;
  status: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MovieFormData {
  title: string;
  genre: string;
  release_year?: number;
  daily_rate?: number;
  price?: number
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface Inventory {
  id: number;
  movie: number;
  movie_title: string;
  total_copies: number;
  available_copies: number;
  rented_out: number
}

export interface TopMovie {
  movie__title: string;
  total: number;
}


export interface SystemAnalytics {
  top_movies: TopMovie[];
  total_customers: number;
  total_rentals: number;
  active_rentals: number;
  total_revenue: string;
}