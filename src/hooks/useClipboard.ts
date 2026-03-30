import { useState, useCallback } from 'react';

export function useClipboard() {
  const [hijackWarning, setHijackWarning] = useState(false);

  const pasteFromClipboard = useCallback(async (): Promise<string> => {
    setHijackWarning(false);
    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text.trim();

      // Re-read after a short delay to detect clipboard hijacking
      await new Promise((r) => setTimeout(r, 150));
      const recheck = await navigator.clipboard.readText();
      if (recheck.trim() !== trimmed) {
        setHijackWarning(true);
      }

      return trimmed;
    } catch {
      return '';
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { pasteFromClipboard, copyToClipboard, hijackWarning, setHijackWarning };
}
