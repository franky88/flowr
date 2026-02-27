import { useState, useCallback } from "react";

function evalArithmetic(expr: string): string {
  const sanitized = expr.replace(/[^0-9+\-*/().]/g, "").trim();
  if (!sanitized) return "";
  try {
    // Safe eval: only allow numbers and arithmetic operators
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (typeof result !== "number" || !isFinite(result) || result < 0) return expr;
    return String(Math.round(result * 100) / 100);
  } catch {
    return expr;
  }
}

export function useArithmeticInput(onChange: (val: string) => void, value: string) {
  const [display, setDisplay] = useState(value);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    const result = evalArithmetic(display);
    setDisplay(result);
    onChange(result);
  }, [display, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const result = evalArithmetic(display);
      setDisplay(result);
      onChange(result);
    }
  }, [display, onChange]);

  return { display, handleChange, handleBlur, handleKeyDown };
}