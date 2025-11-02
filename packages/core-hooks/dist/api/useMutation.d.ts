export type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface UseMutationOptions<T, V = any> {
    method?: HttpMethod;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    headers?: Record<string, string>;
    _variables?: V;
}
export interface UseMutationReturn<T, V> {
    mutate: (variables: V) => Promise<T | undefined>;
    isLoading: boolean;
    error: Error | null;
    data: T | null;
    reset: () => void;
}
export declare function useMutation<T = any, V = any>(url: string, options?: UseMutationOptions<T, V>): UseMutationReturn<T, V>;
//# sourceMappingURL=useMutation.d.ts.map