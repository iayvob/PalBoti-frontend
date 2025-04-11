"use client";
import type React from "react";
import type { Metadata } from "next";
import { ToastProvider } from "../components/ui/toast";
import { ThemeProvider } from "../components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { OverlayProvider } from "@/contexts/overlay-context";

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
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OverlayProvider>
            <ToastProvider>
              {children}
              <ToastProvider />
            </ToastProvider>
          </OverlayProvider>
        </ThemeProvider>
      </SessionProvider>
    </main>
  );
}
