import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to PalBoti</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Sign up
            </Link>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
