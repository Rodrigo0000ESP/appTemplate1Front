export interface User {
    id: string | number;
    email?: string;
    name?: string;
    [key: string]: any;
}
export interface UseAuthReturn<T extends User = User> {
    user: T | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export declare function useAuth<T extends User = User>(): UseAuthReturn<T>;
export declare function setAuthUser<T extends User = User>(user: T, token: string): void;
export declare function clearAuthUser(): void;
export declare function getAuthToken(): string | null;
//# sourceMappingURL=useAuth.d.ts.map