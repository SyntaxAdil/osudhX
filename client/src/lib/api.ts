import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TokenResponse {
  token: string;
}
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
    
  const { data } = await authClient.$fetch<TokenResponse>("/token");

  const token = data?.token;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};
