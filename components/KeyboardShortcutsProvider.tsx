"use client";

import { useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTransactionModal } from "@/hooks/useTransactionModal"; // your modal state
import { useCommandPalette } from "@/hooks/useCommandPalette"; // your palette state

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { open: openTransaction } = useTransactionModal();
  const { open: openPalette } = useCommandPalette();

  useKeyboardShortcuts([
    // N → new transaction (ignore in inputs)
    {
      key: "n",
      ignoreInInput: true,
      handler: () => openTransaction(),
    },
    // ⌘K / Ctrl+K → command palette
    {
      key: "k",
      meta: true,
      handler: () => openPalette(),
    },
    {
      key: "k",
      ctrl: true,
      handler: () => openPalette(),
    },
    // ? → shortcut reference
    {
      key: "?",
      ignoreInInput: true,
      handler: () => router.push("/help/keyboard-shortcuts"),
    },
    // T → jump to current month (handled at page level too)
    {
      key: "t",
      ignoreInInput: true,
      handler: () => {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        router.push(`/dashboard?month=${month}`);
      },
    },
  ]);

  return <>{children}</>;
}
