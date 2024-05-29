import { Delete, Get, Patch, Post, Put } from "@nestjs/common";
import { HttpMethod } from "@nna/core";

/**
 * Route handler (method) Decorator.
 * Routes HTTP method requests to the specified path(s).
 *
 * @param method of the router handler
 * @param path of the request(s) to handle
 * @returns a method decorator that handles a HTTP request
 */
export function HttpHandleMethod(
	method: HttpMethod,
	path?: string[] | string,
): MethodDecorator {
	switch (method) {
		case "GET":
			return Get(path);
		case "POST":
			return Post(path);
		case "PATCH":
			return Patch(path);
		case "PUT":
			return Put(path);
		case "DELETE":
			return Delete(path);
	}
}
