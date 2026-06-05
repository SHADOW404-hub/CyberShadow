export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  country: string | null;
  role: UserRole;
  created_at?: string;
}

export interface Challenge {
  id: string;
  name: string;
  points: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  flag: string;
  link: string | null;
  file_url: string | null;
  created_by: string;
  solves_count: number;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing';
  duration?: number;
}
