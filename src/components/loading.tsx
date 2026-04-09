import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Loading({ size = "default", className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary",
          size === "sm" && "h-4 w-4",
          size === "default" && "h-8 w-8",
          size === "lg" && "h-12 w-12"
        )}
      />
    </div>
  );
}

export function LoadingPage({ message }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loading size="lg" />
      {message && (
        <p className="mt-4 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}