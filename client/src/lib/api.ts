import { authClient } from "./auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TokenResponse {
  token: string;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> => {
  console.log("apiFetch:", endpoint);
  console.log("requiresAuth:", requiresAuth);

  let token: string | undefined;

  if (requiresAuth) {
    console.log("Getting auth token...");

    const { data, error } =
      await authClient.$fetch<TokenResponse>("/token");

    console.log("Token response:", data);
    console.log("Token error:", error);

    if (error || !data?.token) {
      console.error("No token found");
      throw new Error("Unauthorized");
    }

    token = data.token;

    console.log("Token received");
  }

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log("Sending request:", `${API_URL}${endpoint}`);
  console.log(
    "Authorization header:",
    token ? "Bearer token attached" : "No token",
  );

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    console.error("API error:", errorData);

    throw new Error(
      errorData?.message || `Request failed with ${response.status}`,
    );
  }

  return response.json();
};