import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TokenResponse {
  token: string;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { data, error } =
    await authClient.$fetch<TokenResponse>("/token");

  if (error || !data?.token) {
    console.error("Failed to get auth token:", error);
    throw new Error("Unauthorized");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    console.error("API Error:", {
      status: response.status,
      endpoint,
      data: errorData,
    });

    throw new Error(
      errorData?.message || `Request failed with ${response.status}`,
    );
  }

  return response.json();
};