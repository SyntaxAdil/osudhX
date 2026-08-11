import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins";

import { prisma } from "./prisma";
import env from "../config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    },
  },

  trustedOrigins: [env.clientUrl],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "customer",
      },
    },
  },

  plugins: [jwt()],
});