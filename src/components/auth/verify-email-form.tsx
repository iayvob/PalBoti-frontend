"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockApiCall } from "@/utils/authUtils";
import { useOverlay } from "@/contexts/overlay-context";
import axios from "axios";
import { SERVER_API_URL } from "@/config/consts";

interface ResendVerificationSchema {
  email: string;
}

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { requestOverlay, hideOverlay } = useOverlay();

  // Get token from URL
  const token = searchParams.get("token");

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Verify token if present in URL
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenValid(false);
        return;
      }
      try {
        requestOverlay(true);
        const response = await axios.post(
          `${SERVER_API_URL.v2}/auth/verify-email?token=${token}`,
          {},
          { headers: { "Content-Type": "application/json" } }
        );
        // Expecting a 204 No Content on success
        if (response.status === 204) {
          setTokenValid(true);
          setVerifySuccess(true);
          toast({ title: "Email verified successfully" });
        } else {
          setTokenValid(false);
          toast({ title: "Invalid or expired token" });
        }
      } catch (error) {
        console.error(error);
        setTokenValid(false);
        toast({ title: "Invalid or expired token" });
      } finally {
        hideOverlay();
      }
    }
    verifyToken();
  }, [token, toast, requestOverlay, hideOverlay]);

  // Countdown effect after successful verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verifySuccess && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (verifySuccess && countdown === 0) {
      router.push("/sign-in");
    }
    return () => clearInterval(interval);
  }, [verifySuccess, countdown, router]);

  // Form for resending verification email
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  // Countdown effect after successful verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verifySuccess && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (verifySuccess && countdown === 0) {
      router.push("/auth/login");
    }
    return () => clearInterval(interval);
  }, [verifySuccess, countdown, router]);

  const onResendSubmit: SubmitHandler<ResendVerificationSchema> = async (
    data
  ) => {
    try {
      setIsResending(true);
      requestOverlay(true);
      const {
        status,
        data: resData,
      }: { status: number; data: { error?: string; message?: string } } =
        await axios.post(
          `${SERVER_API_URL.v2}/auth/send-verification-email`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );
      if (status === 200 && resData.message) {
        toast({ title: resData.message });
        reset();
      } else if (status === 404 && resData.error) {
        toast({ title: resData.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error sending verification link" });
    } finally {
      setIsResending(false);
      hideOverlay();
    }
  };

  // If token verification was successful, show success message
  if (tokenValid && verifySuccess) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Email Verified Successfully
          </h2>
          <p className="text-muted-foreground mb-4" aria-live="polite">
            Redirecting to login in {countdown} second
            {countdown !== 1 ? "s" : ""}
          </p>
          <p className="text-foreground mb-6">
            Your email has been verified. You will be redirected shortly.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
          >
            Go to Login Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If token is invalid or not present, show manual verification form or resend option
  if (tokenValid === false) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Invalid or Expired Token
          </h2>
          <p className="text-muted-foreground mb-6">
            The email verification token provided is invalid or has expired.
          </p>
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950/30"
                >
                  Resend Verification Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Resend Verification Email</DialogTitle>
                  <DialogDescription>
                    Enter your email address to receive a new verification link
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onResendSubmit)}>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="resend-email">Email</Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="your.email@example.com"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="border-input bg-background text-foreground focus-visible:ring-red-500"
                    />
                    {errors.email && (
                      <p
                        className="text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={isResending}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                      aria-busy={isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          <span>Sending...</span>
                          <span className="sr-only">Loading</span>
                        </>
                      ) : (
                        "Send Link"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="link"
              onClick={() => router.push("/sign-in")}
              className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}