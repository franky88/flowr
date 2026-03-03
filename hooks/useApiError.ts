import { useState, useCallback } from "react";
import { ApiError } from "@/lib/errors";

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof ApiError) {
      setError(err);
    } else if (err instanceof Error) {
      setError(new ApiError(0, { error: "error", message: err.message }));
    }
  }, []);

  const clear = useCallback(() => setError(null), []);

  return { error, handleError, clear };
}