import { useState, useEffect, useCallback } from 'react';
export function useOnlineStatus(options = {}) {
    const { pingInterval = 30000, pingUrl = 'https://www.google.com/favicon.ico', onOffline, onOnline, } = options;
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [isChecking, setIsChecking] = useState(false);
    const checkOnlineStatus = useCallback(async () => {
        if (typeof navigator === 'undefined')
            return true;
        setIsChecking(true);
        try {
            await fetch(pingUrl, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
            });
            return true;
        }
        catch (error) {
            return false;
        }
        finally {
            setIsChecking(false);
        }
    }, [pingUrl]);
    const forceCheck = useCallback(async () => {
        const online = await checkOnlineStatus();
        const wasOnline = isOnline;
        setIsOnline(online);
        if (online && !wasOnline) {
            onOnline?.();
        }
        else if (!online && wasOnline) {
            onOffline?.();
        }
    }, [checkOnlineStatus, isOnline, onOnline, onOffline]);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const handleOnline = () => {
            setIsOnline(true);
            onOnline?.();
        };
        const handleOffline = () => {
            setIsOnline(false);
            onOffline?.();
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Periodic check
        const intervalId = setInterval(forceCheck, pingInterval);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(intervalId);
        };
    }, [pingInterval, forceCheck, onOnline, onOffline]);
    return { isOnline, isChecking, forceCheck };
}
