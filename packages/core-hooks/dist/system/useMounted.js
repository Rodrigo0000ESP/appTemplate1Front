import { useEffect, useRef, useCallback } from 'react';
export function useMounted() {
    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    return useCallback(() => mountedRef.current, []);
}
