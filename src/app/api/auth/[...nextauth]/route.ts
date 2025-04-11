import { authOptions } from "@/config/auth-options";
import NextAuth from "next-auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);