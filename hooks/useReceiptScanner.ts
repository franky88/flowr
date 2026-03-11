import { useRef, useState } from "react";

interface ScanResult {
  amount: string;
  date: string;
  type: "income" | "expense";
  note: string;
  categoryId: string | null;
}

interface Category {
  id: string;
  name: string;
  level: number;
}

export function useReceiptScanner(categories: Category[]) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function trigger() {
    inputRef.current?.click();
  }

  async function handleFile(
    file: File,
    onSuccess: (result: ScanResult) => void,
  ) {
    if (!file) return;

    setScanning(true);
    setError(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/ocr-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: file.type,
          categories,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSuccess(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to scan receipt");
    } finally {
      setScanning(false);
    }
  }

  return { scanning, error, trigger, handleFile, inputRef };
}
