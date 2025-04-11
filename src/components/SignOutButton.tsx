"use client";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import logger from "@/utils/chalkLogger";
import axios from "axios";
import { SERVER_API_URL } from "@/config/consts";

export default function SignOutButton() {
  const { status } = useSession();
  const handleSignOut = async () => {
    if (status === "authenticated") {
      const res = await axios.post(`${SERVER_API_URL.v2}/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204 || res.status === 200) {
        // Logout successful
        logger.success("Logout successful");
      } else {
        logger.warning("Logout failed");
      }
      // Redirect to the home page after logout
      signOut({ callbackUrl: "/" });
    }
    if (status === "loading") {
      return <div>Loading...</div>;
    }
    if (status === "unauthenticated") {
      return <div>Please sign in</div>;
    }
  };
  return (
    <div className="p-4 mt-auto">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors"
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" /> Sign Out
      </Button>
    </div>
  );
}
