import { useState, useEffect } from 'react';
export function useDebounce(value, options = {}) {
    const { delay = 300 } = options;
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isDebouncing, setIsDebouncing] = useState(false);
    useEffect(() => {
        setIsDebouncing(true);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
            setIsDebouncing(false);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return { debouncedValue, isDebouncing };
}
