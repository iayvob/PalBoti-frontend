import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { CLIENT_URL, SERVER_API_URL } from "./consts";
import logger from "@/utils/chalkLogger";
import { ENV } from "@/validations/envSchema";
import { LoginSchema, RegisterUserSchema } from "@/validations/authSchema";
import { ClientUserSchema } from "@/validations/userSchema";

// ----------------------------------------------------------------
// Module Augmentation for NextAuth Session & JWT Types
// ----------------------------------------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      lastLogin?: string;
    };
    tokens: {
      access: {
        token: string;
        expires: Date;
      };
      refresh: {
        token: string;
        expires: Date;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    lastLogin?: string;
    tokens: {
      access: {
        token: string;
        expires: Date;
      };
      refresh: {
        token: string;
        expires: Date;
      };
    };
    error?: string;
  }
}

// ----------------------------------------------------------------
// Interfaces for API Responses
// ----------------------------------------------------------------
type RefreshApiResponse = {
  success: string;
  error?: string;
  tokens: {
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  };
};

// ----------------------------------------------------------------
// Helper: Logout API call and sign out the user.
// ----------------------------------------------------------------
async function logoutUser(): Promise<void> {
  try {
    // Post to the server-side logout endpoint
    const res1 = await axios.post(
      `${SERVER_API_URL.test}/auth/logout`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );

    // Call client-side endpoint for additional logout logic
    const res2 = await fetch(`${CLIENT_URL.live}/api/server-logout`, {
      method: "POST",
    });

    // Ensure proper grouping of conditions:
    if ((res1.status === 200 || res1.status === 204) && res2.status === 200) {
      logger.success("Logout successful");
    } else {
      logger.warning("Logout failed");
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    logger.error("Logout error:", errorMessage);
  }
}

// ----------------------------------------------------------------
// Helper: Refresh Access Token via backend refresh endpoint.
// ----------------------------------------------------------------
async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.tokens?.refresh?.token) {
    logger.error("No refresh token available.");
    return { ...token, error: "NoRefreshToken" };
  }

  try {
    const response = await axios.post<{
      success: string;
      tokens: RefreshApiResponse["tokens"];
    }>(
      `${SERVER_API_URL.test}/auth/refresh-tokens`,
      null,
      {
        // Pass the refresh token in a Cookie header
        headers: { Cookie: `jwt=${token.tokens.refresh.token}` },
      }
    );

    // If the status is not 200, log error and sign out the user.
    if (response.status !== 200) {
      logger.error("Failed to refresh access token.");
      await logoutUser();
      return { ...token, error: "RefreshTokenError" };
    }

    logger.info("Access token refreshed successfully.");

    // Parse the expiration dates from the response.
    const accessExpires = new Date(response.data.tokens.access.expires);
    const refreshExpires = new Date(response.data.tokens.refresh.expires);

    return {
      ...token,
      tokens: {
        access: {
          token: response.data.tokens.access.token,
          expires: accessExpires,
        },
        refresh: {
          token: response.data.tokens.refresh.token,
          expires: refreshExpires,
        },
      },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    logger.error("Failed to refresh access token:", errorMessage);
    await logoutUser();
    return { ...token, error: "RefreshTokenExpired" };
  }
}

// ----------------------------------------------------------------
// NextAuth Options: Handles Email/Password (Login/Signup)
// ----------------------------------------------------------------
export const authOptions: NextAuthOptions = {
  secret: ENV.NEXTAUTH_SECRET,
  providers: [
    // CredentialsProvider expects an array, which is correctly provided here.
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
        isSignup: {
          label: "isSignup",
          type: "text",
          placeholder: "true or false",
        },
        name: {
          label: "Name",
          type: "text",
          placeholder: "Your name",
        },
        dontRememberMe: {
          label: "dontRememberMe",
          type: "text",
          placeholder: "true or false",
        },
      },
      async authorize(credentials) {
        // Ensure credentials exist
        if (!credentials) {
          logger.error("Missing credentials");
          return null;
        }

        const isSignup = credentials.isSignup === "true";
        const isDontRememberMe = credentials.dontRememberMe === "true";

        try {
          if (isSignup) {
            // Prepare data for registration
            const dataToSend: RegisterUserSchema = {
              email: credentials.email,
              password: credentials.password,
              name: credentials.name,
              dontRememberMe: isDontRememberMe,
            };
            const res = await axios.post<{
              success: string;
              user: ClientUserSchema;
            }>(`${SERVER_API_URL.test}/auth/register`, dataToSend);

            if (res.status !== 201) {
              logger.error("Sign up failed.");
              return null;
            }
            return res.data.user;
          } else {
            // Prepare data for login
            const dataToSend: LoginSchema = {
              email: credentials.email,
              password: credentials.password,
            };
            const res = await axios.post<{
              success: string;
              user: ClientUserSchema;
            }>(`${SERVER_API_URL.test}/auth/login`, dataToSend);

            if (res.status !== 200) {
              logger.error("Login failed.");
              return null;
            }
            return res.data.user;
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error("Auth provider error:", errorMessage);
          return null;
        }
      },
    }),
  ],

  // ----------------------------------------------------------------
  // Callbacks: JWT & Session callbacks to store and refresh tokens.
  // ----------------------------------------------------------------
  callbacks: {
    // JWT callback invoked on sign in and subsequent token refresh cycles.
    async jwt({ token, user }) {
      try {
        // Initial sign-in: attach user info and tokens
        if (user) {
          const clientUser = user as ClientUserSchema;
          return {
            id: clientUser.id,
            name: clientUser.name,
            email: clientUser.email,
            tokens: {
              access: {
                token: clientUser.tokens.access.token,
                expires: new Date(clientUser.tokens.access.expires),
              },
              refresh: {
                token: clientUser.tokens.refresh.token,
                expires: new Date(clientUser.tokens.refresh.expires),
              },
            },
          };
        }

        // If the current access token is valid, return it
        if (
          token?.tokens?.access?.token &&
          token?.tokens?.access?.expires &&
          Date.now() < new Date(token.tokens.access.expires).getTime()
        ) {
          return token;
        }

        // If token has expired but a refresh token exists, attempt to refresh
        if (token?.tokens?.refresh?.token) {
          return await refreshAccessToken(token);
        }

        // If no refresh token is available, log out the user
        logger.error("No refresh token available.");
        await logoutUser();
        return {
          ...token,
          tokens: {
            access: { token: "", expires: new Date(0) },
            refresh: { token: "", expires: new Date(0) },
          },
          error: "NoRefreshTokenAvailable",
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error("JWT callback error:", errorMessage);
        await logoutUser();
        return {
          ...token,
          tokens: {
            access: { token: "", expires: new Date(0) },
            refresh: { token: "", expires: new Date(0) },
          },
          error: "JWTCallbackError",
        };
      }
    },

    // Session callback attaches token details to the session.
    async session({ session, token }): Promise<typeof session> {
      if (!token.name) {
        return session;
      }
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        lastLogin: token.lastLogin,
      };
      session.tokens = {
        access: {
          token: token.tokens.access.token,
          expires: token.tokens.access.expires,
        },
        refresh: {
          token: token.tokens.refresh.token,
          expires: token.tokens.refresh.expires,
        },
      };
      return session;
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: ENV.JWT_SECRET },
  debug: ENV.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);
