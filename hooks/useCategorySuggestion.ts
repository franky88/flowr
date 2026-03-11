import { useEffect, useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
  level: number;
}

export function useCategorySuggestion(
  note: string,
  type: string,
  categories: Category[],
  currentCategory: string,
) {
  const [suggestedId, setSuggestedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't suggest if category already selected or note too short
    if (currentCategory || note.trim().length < 3) {
      setSuggestedId(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/suggest-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            note,
            type,
            categories: categories.map((c) => ({ id: c.id, name: c.name })),
          }),
        });
        const data = await res.json();
        console.log("Suggestion response:", data);
        setSuggestedId(data.categoryId ?? null);
      } catch {
        setSuggestedId(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [note, type, currentCategory]);

  const dismiss = () => setSuggestedId(null);

  return { suggestedId, loading, dismiss };
}
