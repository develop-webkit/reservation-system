import { useEffect } from 'react';

const isDevToolsShortcut = (e) => {
  if (e.key === 'F12') return true;
  if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) return true;
  if (e.ctrlKey && e.key.toUpperCase() === 'U') return true;
  return false;
};

// Blocks the right-click context menu and the common DevTools keyboard shortcuts.
// Client-side only — a determined user can still reach DevTools via the browser menu,
// so this is a UX deterrent for the Client role, not a security boundary.
export function useDisableDevTools(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const blockContextMenu = (e) => e.preventDefault();
    const blockShortcut = (e) => {
      if (isDevToolsShortcut(e)) e.preventDefault();
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockShortcut);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcut);
    };
  }, [enabled]);
}
