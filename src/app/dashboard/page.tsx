"use client"
import Image from "next/image";
import DashboardStats from "../../components/dashboard/dashboard-stats";
import RobotStatusSectionLive from "../../components/dashboard/robot-status-section-live";
import ProductClassificationSection from "../../components/dashboard/product-classification-section";
import WarehouseMapSection from "../../components/dashboard/warehouse-map-section";
import InsightsSection from "../../components/dashboard/insights-section";
import { useSession } from "next-auth/react";
import { useOverlay } from "@/contexts/overlay-context";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { status } = useSession();
  const { requestOverlay, hideOverlay } = useOverlay();

  // Overlay on loading state
  useEffect(() => {
    if (status === "loading") requestOverlay(true);
    else hideOverlay();
  }, [status, requestOverlay, hideOverlay]);

  // Redirect on auth
  useEffect(() => {
    if (status === "authenticated") {
      hideOverlay();
      redirect("/dashboard");
    }
  }, [status, hideOverlay]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-primary">
                Warehouse Overview
              </h1>
              <p className="text-muted-foreground">
                Monitor your warehouse operations, robot status, and inventory
                in real-time.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-secondary/50 p-2 rounded-lg">
                <Image
                  src="/images/nest.png"
                  alt="NEST Hackathon"
                  width={80}
                  height={40}
                  className="mr-2"
                />
                <span className="text-sm font-medium">
                  NEST Hackathon Project
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <RobotStatusSectionLive />
        <ProductClassificationSection />
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <WarehouseMapSection />
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="p-6 flex flex-wrap gap-4 justify-center md:justify-between bg-card rounded-lg border">
          <Image
            src="/images/mobilis.png"
            alt="Mobilis"
            width={120}
            height={60}
            className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/deepminds.png"
            alt="DeepMinds"
            width={120}
            height={60}
            className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/images/sonatrach.png"
            alt="Sonatrach"
            width={120}
            height={60}
            className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </>
  );
}
