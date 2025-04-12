"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  resetPasswordSchema,
  ForgotPasswordSchema,
} from "@/validations/authSchema";
import {
  isRateLimited,
  validatePassword,
  mockApiCall,
} from "@/utils/authUtils";
import { useOverlay } from "@/contexts/overlay-context";
import axios from "axios";
import { SERVER_API_URL } from "@/config/consts";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [invalidToken, setInvalidToken] = useState(false);
  const { requestOverlay, hideOverlay } = useOverlay();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get token from URL
  const token = searchParams.get("token");

  // Form setup with react-hook-form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    setValue,
  } = useForm<resetPasswordSchema>({
    defaultValues: {
      password: "",
      token: "",
    },
  });

  // Set token from URL
  useEffect(() => {
    if (token) {
      setValue("token", token);
    } else {
      // If no token is provided, mark as invalid
      setInvalidToken(true);
    }
  }, [token, setValue]);

  // Countdown effect after successful reset
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resetSuccess && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (resetSuccess && countdown === 0) {
      router.push("/sign-in");
    }
    return () => clearInterval(interval);
  }, [resetSuccess, countdown, router]);

  // Forgot password form for requesting a new reset link
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordSchema>({
    defaultValues: { email: "" },
  });

  const onForgotSubmit: SubmitHandler<ForgotPasswordSchema> = async (dataToSend) => {
    const lastSent = localStorage.getItem("lastResetTimestamp");
    const now = Date.now();

    // Check if a reset link was sent in the last 2 minutes
    if (lastSent && now - parseInt(lastSent) < 120000) {
      toast({
        title: "Please wait 2 minutes before requesting another reset link.",
      });
      return;
    }

    try {
      requestOverlay(true);
      const {
        status,
        data,
      }: { status: number; data: { error?: string; message?: string } } =
        await axios.post(
          `${SERVER_API_URL.test}/auth/forgot-password`,
          dataToSend,
          { headers: { "Content-Type": "application/json" } }
        );

      if (status === 200) {
        toast({ title: data.message });
        localStorage.setItem("lastResetTimestamp", now.toString());
        resetForgotForm();
      } else if (status === 404 && data.error) {
        forgotErrors.email = { type: "manual", message: data.error };
        toast({ title: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error sending reset link" });
    } finally {
      hideOverlay();
    }
  };

  // Submit handler for the forgot password form
  const onPasswordSubmit: SubmitHandler<resetPasswordSchema> = async (
    dataToSend
  ) => {
    try {
      setIsSubmitting(true);
      requestOverlay(true);
      const {
        status,
        data,
      }: { status: number; data: { error?: string; message?: string } } =
        await axios.post(
          `${SERVER_API_URL.test}/auth/reset-password?token=${dataToSend.token}`,
          { password: dataToSend.password },
          { headers: { "Content-Type": "application/json" } }
        );

      if (status === 200) {
        toast({ title: data.message });
        resetForgotForm();
        // Set reset success and start the countdown to login.
        setResetSuccess(true);
      } else if (status === 404 && data.error) {
        // Set invalidToken state so that an error UI is shown.
        setInvalidToken(true);
        toast({ title: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error resetting password" });
    } finally {
      hideOverlay();
      setIsSubmitting(false);
    }
  };

  // If the reset was successful, show a success message with countdown
  if (resetSuccess) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Password Reset Successful
          </h2>
          <p className="text-muted-foreground mb-4" aria-live="polite">
            Redirecting to login in {countdown} second
            {countdown !== 1 ? "s" : ""}
          </p>
          <p className="text-foreground mb-6">
            Your password has been reset successfully. Please wait while we
            redirect you.
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

  // If the token was deemed invalid, show an error message with a dialog to request a new reset link
  if (invalidToken) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            Invalid or Expired Token
          </h2>
          <p className="text-muted-foreground mb-6">
            The reset token provided is invalid or has expired.
          </p>
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950/30"
                >
                  Request New Reset Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Forgot Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address to reset your password
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitForgot(onForgotSubmit)}>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Email address"
                      aria-required="true"
                      aria-invalid={!!forgotErrors.email}
                      {...registerForgot("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="border-input bg-background text-foreground focus-visible:ring-red-500"
                    />
                    {forgotErrors.email && (
                      <p
                        className="text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {forgotErrors.email.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                    >
                      Send Link
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

  // Otherwise, show the reset password form
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmitPassword(onPasswordSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-foreground">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                aria-required="true"
                aria-invalid={!!passwordErrors.password}
                {...registerPassword("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="border-input bg-background text-foreground focus-visible:ring-red-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordErrors.password && (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {passwordErrors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Resetting password...</span>
                <span className="sr-only">Loading</span>
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
