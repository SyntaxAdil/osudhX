import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TokenResponse {
  token: string;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> => {
  let token: string | undefined;

  if (requiresAuth) {
    const { data, error } = await authClient.$fetch<TokenResponse>("/token");
    console.log(data, "token");
    if (error || !data?.token) {
      throw new Error("Unauthorized");
    }

    token = data.token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || `Request failed with ${response.status}`,
    );
  }

  return response.json();
};
