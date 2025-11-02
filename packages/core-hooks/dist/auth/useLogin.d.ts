import { User } from './useAuth';
export interface LoginCredentials {
    email: string;
    password: string;
    [key: string]: any;
}
export interface LoginResponse<T extends User = User> {
    user: T;
    token: string;
    [key: string]: any;
}
export interface UseLoginOptions<T extends User = User> {
    apiUrl?: string;
    onSuccess?: (user: T, token: string) => void;
    onError?: (error: Error) => void;
}
export interface UseLoginReturn<T extends User = User> {
    login: (credentials: LoginCredentials) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    _user?: T;
}
export declare function useLogin<T extends User = User>(options?: UseLoginOptions<T>): UseLoginReturn<T>;
//# sourceMappingURL=useLogin.d.ts.map