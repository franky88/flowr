"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { create } from "zustand";
import { useRouter } from "next/navigation";

// ─── Store ────────────────────────────────────────────────────────────────────

interface CommandPaletteStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandPalette = create<CommandPaletteStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

// ─── Command definitions ──────────────────────────────────────────────────────

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  group: "Navigate" | "Actions" | "Help";
  keywords?: string[];
  action: () => void;
}

function useCommands(): Command[] {
  const router = useRouter();
  const { close, open } = useCommandPalette();
  const { open: openTransaction } = useTransactionModal();

  const go = (path: string) => {
    router.push(path);
    close();
  };

  return [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      description: "Overview & summary",
      icon: "⊞",
      group: "Navigate",
      keywords: ["home", "overview"],
      action: () => go("/dashboard"),
    },
    {
      id: "nav-transactions",
      label: "Transactions",
      description: "View & manage transactions",
      icon: "↕",
      group: "Navigate",
      keywords: ["tx", "entries", "log"],
      action: () => go("/transactions"),
    },
    {
      id: "nav-budgets",
      label: "Budgets",
      description: "Monthly budget targets",
      icon: "◎",
      group: "Navigate",
      keywords: ["budget", "limits", "targets"],
      action: () => go("/budgets"),
    },
    {
      id: "nav-cashflow",
      label: "Cashflow",
      description: "Daily running balance",
      icon: "∿",
      group: "Navigate",
      keywords: ["cashflow", "balance", "daily"],
      action: () => go("/cashflow"),
    },
    {
      id: "action-new-tx",
      label: "New transaction",
      description: "Log income or expense",
      icon: "+",
      group: "Actions",
      keywords: ["add", "create", "log", "income", "expense"],
      action: () => {
        close();
        openTransaction();
      },
    },
    {
      id: "action-current-month",
      label: "Jump to current month",
      description: "Navigate to today's month",
      icon: "◷",
      group: "Actions",
      keywords: ["today", "now", "current"],
      action: () => {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        go(`/dashboard?month=${month}`);
      },
    },
    {
      id: "help-shortcuts",
      label: "Keyboard shortcuts",
      description: "View all shortcuts",
      icon: "⌨",
      group: "Help",
      keywords: ["keys", "hotkeys", "shortcuts"],
      action: () => go("/help/keyboard-shortcuts"),
    },
  ];
}

// ─── Fuzzy match ──────────────────────────────────────────────────────────────

function matches(cmd: Command, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    cmd.label.toLowerCase().includes(q) ||
    (cmd.description?.toLowerCase().includes(q) ?? false) ||
    (cmd.keywords?.some((k) => k.includes(q)) ?? false)
  );
}

// ─── Fake modal hook (replace with your real one) ─────────────────────────────

const useTransactionModal = create<{ open: () => void }>(() => ({
  open: () => console.log("open transaction modal"),
}));

// ─── Components ───────────────────────────────────────────────────────────────

const GROUP_ORDER: Command["group"][] = ["Actions", "Navigate", "Help"];

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const allCommands = useCommands();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = allCommands.filter((c) => matches(c, query));

  // Group filtered results
  const grouped = GROUP_ORDER.reduce<Record<string, Command[]>>((acc, g) => {
    const cmds = filtered.filter((c) => c.group === g);
    if (cmds.length) acc[g] = cmds;
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  const runActive = useCallback(() => {
    flat[activeIndex]?.action();
  }, [flat, activeIndex]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Keyboard nav inside palette
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runActive();
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, flat, runActive, close]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Palette */}
      <div className="fixed left-1/2 top-[20vh] z-50 w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="text-muted-foreground text-sm">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No commands found for &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(grouped).map(([group, cmds]) => {
              return (
                <div key={group} className="mb-2 last:mb-0">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </div>
                  {cmds.map((cmd) => {
                    const globalIndex = flat.indexOf(cmd);
                    const isActive = globalIndex === activeIndex;
                    return (
                      <button
                        key={cmd.id}
                        data-index={globalIndex}
                        onClick={cmd.action}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-sm font-mono">
                          {cmd.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {cmd.label}
                          </div>
                          {cmd.description && (
                            <div className="truncate text-xs text-muted-foreground">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2">
          <span className="text-[11px] text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              ↑↓
            </kbd>{" "}
            navigate
          </span>
          <span className="text-[11px] text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>{" "}
            select
          </span>
          <span className="text-[11px] text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </>
  );
}
