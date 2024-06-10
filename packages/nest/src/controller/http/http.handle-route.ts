import { HttpRoute } from "@nna/core";
import { joinSegments } from "packages/core/src/http/route";

import { HttpHandleMethod } from "./http.handle-method";

/**
 * Handles Http Route definition
 *
 * @param route definition to handle
 * @returns a method decorator that handles a HTTP request
 */
export function HttpHandleRoute(
	route: HttpRoute.AnyDefinition,
): MethodDecorator {
	return HttpHandleMethod(
		route.method,
		joinSegments(
			route.segments as HttpRoute.Segment[],
			({ param }) => `:${param}`,
		),
	);
}
