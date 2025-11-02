export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';
export interface UseWindowSizeOptions {
    debounceDelay?: number;
    breakpoints?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}
export interface UseWindowSizeReturn {
    width: number;
    height: number;
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isWide: boolean;
}
export declare function useWindowSize(options?: UseWindowSizeOptions): UseWindowSizeReturn;
//# sourceMappingURL=useWindowSize.d.ts.map