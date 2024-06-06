import { HttpMethod } from "./http.method";

/**
 * Definition of a HTTP Route.
 * It should contain information to (at least partially) create clients and implement servers
 */
export interface HttpRoute {
	method: HttpMethod;
	path?: string;
}

// TODO?
// export interface HttpRouteExtended extends HttpRoute {
// 	children: HttpRouteExtended[];
//	// ...
// }
