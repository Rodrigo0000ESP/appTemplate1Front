export interface UsePaginatedQueryOptions<T> {
    pageSize?: number;
    initialPage?: number;
    onSuccess?: (data: T[]) => void;
    onError?: (error: Error) => void;
}
export interface UsePaginatedQueryReturn<T> {
    data: T[];
    page: number;
    totalPages: number;
    isLoading: boolean;
    error: Error | null;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    refetch: () => Promise<void>;
}
export declare function usePaginatedQuery<T = any>(url: string, options?: UsePaginatedQueryOptions<T>): UsePaginatedQueryReturn<T>;
//# sourceMappingURL=usePaginatedQuery.d.ts.map