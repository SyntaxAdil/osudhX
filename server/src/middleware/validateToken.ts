import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:5000";

const JWKS = createRemoteJWKSet(
  new URL(`${baseUrl}/api/auth/jwks`)
);

const validateToken = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: baseUrl,
      audience: baseUrl,
    });

    return payload;
  } catch (error) {
    console.error("Token validation failed:", error);
    throw new Error("Invalid or expired token");
  }
};

export default validateToken;