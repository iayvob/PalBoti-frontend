import type React from "react";
import type { Metadata } from "next";
import DashboardLayout from "../../components/dashboard/dashboard-layout";

export const metadata: Metadata = {
  title: "Dashboard | Smart Warehouse Manager",
  description:
    "Monitor your warehouse operations, robot status, and inventory in real-time",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
