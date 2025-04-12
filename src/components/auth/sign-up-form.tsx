"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/authUtils";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  dontRememberMe?: boolean;
};

export function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      dontRememberMe: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      // Validate password strength
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        toast({
          title: "Password Error",
          description: passwordValidation.message,
          variant: "destructive",
        });
        return;
      }

      // Create user through NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        name: data.name,
        email: data.email,
        dontRememberMe: data.dontRememberMe ? "true" : "false",
        password: data.password,
        isSignup: "true",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Account Created!",
        description: "Welcome to our platform!",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      redirect("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Session Persistence Control */}
            <div className="flex items-center space-x-2">
              <Controller
                name="dontRememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="dont-remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="dont-remember" className="text-sm">
                Don't remember me (log out when browser closes)
              </Label>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  rules={{ required: "You must accept the terms to continue" }}
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-primary underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
