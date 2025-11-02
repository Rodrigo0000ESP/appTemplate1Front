import { useEffect, useRef } from 'react';

export interface UseKeyboardShortcutOptions {
  preventDefault?: boolean;
  enabled?: boolean;
}

type KeyboardEventHandler = (event: KeyboardEvent) => void;

export function useKeyboardShortcut(
  keys: string | string[],
  callback: KeyboardEventHandler,
  options: UseKeyboardShortcutOptions = {}
): void {
  const { preventDefault = false, enabled = true } = options;
  const callbackRef = useRef<KeyboardEventHandler>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const keyArray = Array.isArray(keys) ? keys : [keys];
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      for (const shortcut of keyArray) {
        const parts = shortcut.toLowerCase().split('+').map(p => p.trim());
        
        let requiresCtrl = false;
        let requiresShift = false;
        let requiresAlt = false;
        let targetKey = '';

        for (const part of parts) {
          if (part === 'ctrl' || part === 'control' || part === 'cmd' || part === 'meta') {
            requiresCtrl = true;
          } else if (part === 'shift') {
            requiresShift = true;
          } else if (part === 'alt' || part === 'option') {
            requiresAlt = true;
          } else {
            targetKey = part;
          }
        }

        const ctrlMatch = requiresCtrl === ctrl;
        const shiftMatch = requiresShift === shift;
        const altMatch = requiresAlt === alt;
        const keyMatch = pressedKey === targetKey;

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callbackRef.current(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, preventDefault, enabled]);
}
