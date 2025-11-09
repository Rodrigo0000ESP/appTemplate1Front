export interface detail {
    message: string;
    type: string;
}

/**
 * Empty object type for responses that only return detail
 */
export type EmptyResponse = {
    detail?: detail;
};

/**
 * Generic API Response wrapper that adds optional detail field
 * Use this to wrap any API response type
 * @example ApiResponse<UserResponse>
 * @example ApiResponse<TokenResponse>
 * @example ApiResponse<EmptyResponse> for responses with only detail
 */
export type ApiResponse<T> = T & {
    detail?: detail;
};