/**
 * Interface representing a standard API response
 * @template T - The type of the data property
 */
interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: { message: string; code?: string };
    timestamp?: string;
}

/**
 * Creates a success response object
 * @param data - The data to include in a response
 * @param message - A message providing additional information about the response
 * @returns
 */
export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
    status: "success",
    data,
    message,
});

/**
 * Creates a standardized error response object.
 * This ensures all API errors follow the same format for consistent client handling.
 *
 * @param {string} message - The error message to display to the client.
 * @param {string} code - The error code for programmatic handling.
 * @returns {object} A formatted error response object.
 */
export const errorResponse = (message: string, code: string) => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});
