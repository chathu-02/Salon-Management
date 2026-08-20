export type UserRole = 'OWNER' | 'RECEPTIONIST' | 'CLIENT';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'ONLINE' | 'CASH' | 'CARD';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  duration_minutes: number;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  service_id: string;
  service?: Service;
  staff_id?: string | null;
  staff_name?: string | null;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  payment_id?: string;
  payment?: Payment;
  review_submitted?: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  appointment_id: string;
  client_id: string;
  client_name?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string;
  paid_at?: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  appointment_id: string;
  client_id: string;
  client_name: string;
  client_avatar?: string;
  service_id: string;
  service_name: string;
  rating: number; // 1 - 5
  comment: string;
  created_at: string;
}

export interface AuthSession {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
