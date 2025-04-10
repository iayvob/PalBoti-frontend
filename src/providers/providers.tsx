"use client";
import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ToastProvider } from "../components/ui/toast";
import { ThemeProvider } from "../components/theme-provider";
import AuthWarper from "./auth-warpper";

export const metadata: Metadata = {
  title: "Smart Warehouse Manager | PalBoti",
  description:
    "An end-to-end web application for warehouse management with autonomous robots",
  keywords:
    "warehouse management, robotics, automation, inventory management, PalBoti",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {" "}
      <ClerkProvider appearance={{ layout: { logoPlacement: "inside" } }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AuthWarper>{children}</AuthWarper>
          </ToastProvider>
        </ThemeProvider>
      </ClerkProvider>
    </main>
  );
}
