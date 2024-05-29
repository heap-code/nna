/** All available HTTP methods */
export const HTTP_METHODS = ["DELETE", "GET", "PATCH", "POST", "PUT"] as const;

/** Type of HTTP methods */
export type HttpMethod = (typeof HTTP_METHODS)[number];

/**
 * Verify that a given value is a {@link HttpMethod}
 *
 * @param value to test
 * @returns If the given `value` is a valid {@link HttpMethod}
 */
export function isHttpMethod(value: unknown): value is HttpMethod {
	return HTTP_METHODS.includes(value as never);
}
