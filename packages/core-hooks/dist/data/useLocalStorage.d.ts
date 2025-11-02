export interface UseLocalStorageOptions {
    syncAcrossTabs?: boolean;
    serializer?: (value: any) => string;
    deserializer?: (value: string) => any;
}
export type UseLocalStorageReturn<T> = [
    T,
    (value: T | ((prev: T) => T)) => void,
    () => void
];
export declare function useLocalStorage<T>(key: string, defaultValue: T, options?: UseLocalStorageOptions): UseLocalStorageReturn<T>;
//# sourceMappingURL=useLocalStorage.d.ts.map