"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/errors";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const STATUS_COPY: Record<number, { title: string; description: string }> = {
  400: {
    title: "Bad request",
    description: "Something was wrong with the data sent to the server.",
  },
  401: { title: "Session expired", description: "Sign in again to continue." },
  403: {
    title: "Access denied",
    description: "You don't have permission to view this.",
  },
  404: {
    title: "Not found",
    description: "This resource doesn't exist or was deleted.",
  },
  402: {
    title: "Plan limit reached",
    description: "Upgrade your plan to continue.",
  },
  429: {
    title: "Too many requests",
    description: "Slow down — try again in a moment.",
  },
  500: {
    title: "Server error",
    description: "Something went wrong on our end. Try again shortly.",
  },
};

export default function ErrorPage({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Log to your error tracking (e.g. Sentry) here
    console.error("[app error]", error);
  }, [error]);

  const isApiError = error instanceof ApiError;
  const status = isApiError ? error.status : 0;
  const copy = STATUS_COPY[status] ?? {
    title: "Something went wrong",
    description: error.message || "An unexpected error occurred.",
  };

  const handleAuth = () => router.push("/sign-in");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      {status > 0 && (
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          {status}
        </span>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {copy.description}
      </p>

      {/* Field-level validation errors (e.g. form submissions that bubble up) */}
      {isApiError && error.fields && (
        <ul className="text-left text-sm text-destructive space-y-1 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          {Object.entries(error.fields).map(([field, msg]) => (
            <li key={field}>
              <span className="font-medium capitalize">{field}:</span> {msg}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        {status === 401 ? (
          <button
            onClick={handleAuth}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </button>
        ) : (
          <>
            <button
              onClick={() => router.back()}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Go back
            </button>
            <button
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </>
        )}
      </div>

      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground/50">
          ref: {error.digest}
        </p>
      )}
    </div>
  );
}
