export interface UseOnlineStatusOptions {
    pingInterval?: number;
    pingUrl?: string;
    onOffline?: () => void;
    onOnline?: () => void;
}
export interface UseOnlineStatusReturn {
    isOnline: boolean;
    isChecking: boolean;
    forceCheck: () => Promise<void>;
}
export declare function useOnlineStatus(options?: UseOnlineStatusOptions): UseOnlineStatusReturn;
//# sourceMappingURL=useOnlineStatus.d.ts.map