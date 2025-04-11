import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 pt-[4rem]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="md:text-5xl">
              Pal<span className="text-primary">Botii</span>
            </span>
            <br />
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Sign in
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
