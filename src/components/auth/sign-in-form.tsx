"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  LoginSchema,
  ForgotPasswordSchema,
} from "@/validations/authSchema";
import { useOverlay } from "@/contexts/overlay-context";
import { signIn, useSession } from "next-auth/react";
import { SERVER_API_URL } from "@/config/consts";
import logger from "@/utils/chalkLogger";
import axios from "axios";

export function SignInForm() {
  const { status } = useSession();
  const { requestOverlay, hideOverlay } = useOverlay();
  const router = useRouter();
  const { toast } = useToast();

  // Local state variables
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState<number | null>(null);

  // Overlay management on session status
  useEffect(() => {
    if (status === "loading") {
      requestOverlay(true);
    } else {
      hideOverlay();
    }
  }, [status, requestOverlay, hideOverlay]);

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      hideOverlay();
      router.push("/dashboard");
    }
  }, [status, hideOverlay, router]);

  // Form setup for Sign In using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form setup for Forgot Password using react-hook-form
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordSchema>({
    defaultValues: { email: "" },
  });

  // Sign in submission handler
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true);
    requestOverlay(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/dashboard",
        email: data.email,
        password: data.password,
        isSignup: "false",
      });

      if (result?.ok) {
        setAuthStatus(200);
        toast({ title: "Sign in successfully" });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        logger.error("Sign in error:", result?.error || "Unknown error");
        setAuthStatus(Number(result?.status));
        toast({
          title: "Sign in failed",
          description: result?.error || "An error occurred. Try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      logger.error("Sign in error:", error as string);
      toast({
        title: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      hideOverlay();
      redirect("/dashboard");
    }
  };

  // Forgot password submission handler (separate form)
  const onForgotSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
    const lastSent = localStorage.getItem("lastResetTimestamp");
    const now = Date.now();
    if (lastSent && now - parseInt(lastSent) < 120000) {
      toast({
        title: "Please wait 2 minutes before requesting another reset link.",
      });
      return;
    }

    try {
      requestOverlay(true);
      const response = await axios.post(
        `${SERVER_API_URL.test}/api/auth/forgot-password`,
        { email: data.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast({
          title: (response?.data as { message?: string })?.message || "Success",
        });
        localStorage.setItem("lastResetTimestamp", now.toString());
        resetForgotForm();
      } else {
        toast({
          title:
            (response?.data as { error?: string })?.error ||
            "Error sending reset link",
        });
      }
    } catch (error) {
      logger.error("Forgot password error", error as string);
      toast({ title: "Error sending reset link" });
    } finally {
      hideOverlay();
    }
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: "Email address is required",
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

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="border-input bg-background text-foreground focus-visible:ring-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    className="text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* "Don't Remember Me" Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 dark:data-[state=checked]:bg-red-500 dark:data-[state=checked]:border-red-500"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-medium text-foreground"
                >
                  Don't remember me
                </Label>
              </div>
            </div>

            {/* Authentication status feedback */}
            {authStatus && (
              <div className="text-sm" role="status" aria-live="polite">
                {authStatus === 200 ? (
                  <p className="text-green-600 dark:text-green-400">
                    Sign in successful. Redirecting...
                  </p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    Invalid email or password. Please try again.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
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
                  <span>Signing in...</span>
                  <span className="sr-only">Loading</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Separate Forgot Password Dialog (outside the sign in form) */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="mt-4 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
          >
            Forgot password?
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address to reset your password.
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
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
