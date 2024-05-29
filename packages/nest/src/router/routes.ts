import { RouteTree, Routes } from "@nestjs/core";

/** Nest module, found in {@link RouteTree}s */
export type RouteModule = NonNullable<RouteTree["module"]>;

/** @internal */
function isRouteTree(
	route: RouteTree | RouteTree["module"],
): route is RouteTree {
	return !!(route && ("path" satisfies keyof RouteTree) in route);
}
/** @internal */
function extractModules(route: RouteTree | RouteTree["module"]): RouteModule[] {
	if (!isRouteTree(route)) {
		// Run the function again with the input as a RouterTree module
		return extractModules({ module: route, path: "" });
	}

	const { children = [], module } = route;

	const head = module ? [module] : [];
	return [...head, ...children.flatMap(extractModules)];
}

/**
 * Extracts all modules from routes parameters, including children
 *
 * @param routes to extract module from
 * @returns Set of the module that were found
 */
export function extractModulesFromRoutes(routes: Routes): Set<RouteModule> {
	return new Set(routes.flatMap(extractModules));
}
