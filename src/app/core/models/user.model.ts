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
  password: string;
  birthDate: string; // "YYYY-MM-DD" format
  image: string;
  role: 'admin' | 'user' | 'moderator';
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: Date | string;
  updated_at: Date | string;
}
