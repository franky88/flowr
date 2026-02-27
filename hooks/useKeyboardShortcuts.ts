import { useEffect, useCallback } from "react";

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  /** Skip if focus is inside an input/textarea/select */
  ignoreInInput?: boolean;
  handler: ShortcutHandler;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handle = useCallback(
    (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
        const metaMatch = s.meta ? e.metaKey : true;
        const ctrlMatch = s.ctrl ? e.ctrlKey : true;
        const shiftMatch = s.shift ? e.shiftKey : true;

        if (s.ignoreInInput) {
          const tag = (e.target as HTMLElement).tagName;
          const isEditable = (e.target as HTMLElement).isContentEditable;
          if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || isEditable)
            continue;
        }

        if (keyMatch && metaMatch && ctrlMatch && shiftMatch) {
          e.preventDefault();
          s.handler(e);
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handle]);
}
