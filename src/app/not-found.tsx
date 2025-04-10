"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-9xl font-bold text-primary">404</div>
      <h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
