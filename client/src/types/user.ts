export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  password?: string | undefined | null;
  image?: string | null | undefined;
  role?: "seller" | "customer"; // Extended for role-based separation
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}