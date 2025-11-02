export interface UseLogoutOptions {
    apiUrl?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}
export interface UseLogoutReturn {
    logout: () => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}
export declare function useLogout(options?: UseLogoutOptions): UseLogoutReturn;
//# sourceMappingURL=useLogout.d.ts.map