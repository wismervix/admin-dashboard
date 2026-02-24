export interface UsersApiResponse {
  users: User[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | string;
  email: string;
  username: string;
  birthDate: string; // "YYYY-MM-DD" format
  image: string;
  role: 'admin' | 'user' | 'moderator' | string;
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
