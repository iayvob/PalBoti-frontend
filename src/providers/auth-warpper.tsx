import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

// Create a loading component
function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    </div>
  );
}

export default function AuthWarper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <AuthLoading />;
  }
  return <>{children}</>;
}
