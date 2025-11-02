import { useState, useEffect, useCallback } from 'react';
export function useLocalStorage(key, defaultValue, options = {}) {
    const { syncAcrossTabs = true, serializer = JSON.stringify, deserializer = JSON.parse, } = options;
    const [value, setValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? deserializer(item) : defaultValue;
        }
        catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });
    const setStoredValue = useCallback((newValue) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);
            localStorage.setItem(key, serializer(valueToStore));
        }
        catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, value, serializer]);
    const removeValue = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setValue(defaultValue);
        }
        catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, defaultValue]);
    useEffect(() => {
        if (!syncAcrossTabs)
            return;
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setValue(deserializer(e.newValue));
                }
                catch (error) {
                    console.error(`Error syncing localStorage key "${key}":`, error);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, syncAcrossTabs, deserializer]);
    return [value, setStoredValue, removeValue];
}
