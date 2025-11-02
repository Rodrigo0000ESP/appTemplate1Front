export interface UseFetchOptions<T> {
    staleTime?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
}
export interface UseFetchReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
export declare function useFetch<T = any>(url: string | null, options?: UseFetchOptions<T>): UseFetchReturn<T>;
//# sourceMappingURL=useFetch.d.ts.map