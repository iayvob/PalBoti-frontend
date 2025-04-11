"use client"
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import LoadingSpinner from "@/components/loader";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a new password for your account
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </div>
    </Suspense>
  );
}
