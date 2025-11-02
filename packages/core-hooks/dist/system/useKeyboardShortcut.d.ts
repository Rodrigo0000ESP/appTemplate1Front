export interface UseKeyboardShortcutOptions {
    preventDefault?: boolean;
    enabled?: boolean;
}
type KeyboardEventHandler = (event: KeyboardEvent) => void;
export declare function useKeyboardShortcut(keys: string | string[], callback: KeyboardEventHandler, options?: UseKeyboardShortcutOptions): void;
export {};
//# sourceMappingURL=useKeyboardShortcut.d.ts.map