import { HttpRoute } from "@nna/core";

import { HttpHandleMethod } from "./http.handle-method";

/**
 * Handles Http Route definition
 *
 * @param route definition to handle
 * @returns a method decorator that handles a HTTP request
 */
export function HttpHandleRoute(route: HttpRoute): MethodDecorator {
	return HttpHandleMethod(route.method, route.path);
}
