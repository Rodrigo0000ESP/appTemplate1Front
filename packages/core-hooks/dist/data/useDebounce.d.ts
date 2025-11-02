export interface UseDebounceOptions {
    delay?: number;
}
export interface UseDebounceReturn<T> {
    debouncedValue: T;
    isDebouncing: boolean;
}
export declare function useDebounce<T>(value: T, options?: UseDebounceOptions): UseDebounceReturn<T>;
//# sourceMappingURL=useDebounce.d.ts.map