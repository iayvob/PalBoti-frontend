"use client"
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import LoadingSpinner from "@/components/loader";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the verification code sent to your email
            </p>
          </div>
          <VerifyEmailForm />
        </div>
      </div>
    </Suspense>
  );
}
