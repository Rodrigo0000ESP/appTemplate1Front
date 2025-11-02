import { useState, useEffect, useCallback } from 'react';
export function usePaginatedQuery(url, options = {}) {
    const { pageSize = 10, initialPage = 1, onSuccess, onError } = options;
    const [data, setData] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const separator = url.includes('?') ? '&' : '?';
            const paginatedUrl = `${url}${separator}page=${page}&page_size=${pageSize}`;
            const response = await fetch(paginatedUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // Support different response formats
            const items = result.items || result.data || result.results || result;
            const total = result.total_pages || result.totalPages || Math.ceil((result.total || items.length) / pageSize);
            setData(items);
            setTotalPages(total);
            onSuccess?.(items);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            onError?.(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [url, page, pageSize, onSuccess, onError]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const nextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }, [page, totalPages]);
    const prevPage = useCallback(() => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }, [page]);
    const goToPage = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }, [totalPages]);
    return {
        data,
        page,
        totalPages,
        isLoading,
        error,
        nextPage,
        prevPage,
        goToPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        refetch: fetchData,
    };
}
