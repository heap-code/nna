import { Singleton } from "@heap-code/singleton";

import { Definition } from "./definition";
import { paramsSchema } from "./param";
import {
	Segment,
	SegmentPath,
	extractSegmentParams,
	joinSegments,
} from "./segment";
import { AnyFunction } from "../../types";
import { HttpMethod } from "../http.method";

/** Builder for HttpRoute {@link Definition} */
class Builder<const T extends readonly Segment[]> {
	/**
	 * Creates a Builder for `HttpRouteDefinition`
	 *
	 * @param segments for a HttpRoute {@link Definition}
	 */
	public constructor(public readonly segments: T) {}

	/**
	 * Adds a path segment to the builder
	 *
	 * @param segment to add
	 * @returns a builder with the added segment
	 */
	public addSegment<const S extends Segment>(segment: S) {
		return new Builder([...this.segments, segment]);
	}

	/**
	 * Build a route {@link Definition} for a HTTP GET request
	 *
	 *  @returns a {@link Definition} for a HTTP GET request
	 */
	public get<const Handler extends AnyFunction>() {
		return this.request<Handler>("GET");
	}
	/**
	 * Build a route {@link Definition} for a HTTP POST request
	 *
	 *  @returns a {@link Definition} for a HTTP POST request
	 */
	public post<const Handler extends AnyFunction>() {
		return this.request<Handler>("POST");
	}
	/**
	 * Build a route {@link Definition} for a HTTP PATCH request
	 *
	 *  @returns a {@link Definition} for a HTTP PATCH request
	 */
	public patch<const Handler extends AnyFunction>() {
		return this.request<Handler>("PATCH");
	}
	/**
	 * Build a route {@link Definition} for a HTTP PUT request
	 *
	 *  @returns a {@link Definition} for a HTTP PUT request
	 */
	public put<const Handler extends AnyFunction>() {
		return this.request<Handler>("PUT");
	}
	/**
	 * Build a route {@link Definition} for a HTTP DELETE request
	 *
	 *  @returns a {@link Definition} for a HTTP DELETE request
	 */
	public delete<const Handler extends AnyFunction>() {
		return this.request<Handler>("DELETE");
	}

	/**
	 * Builds a Http route definition
	 *
	 * @param method for the definition
	 * @returns a route {@link Definition}
	 */
	public request<const Handler extends AnyFunction>(
		method: HttpMethod,
	): Definition<Handler, T> {
		const segments = this.segments;
		const params = extractSegmentParams(segments);
		const schema = new Singleton(() => paramsSchema(params));

		return {
			// Type reference only
			_handler_: null as never,
			_params_: null as never,

			getParamSchema: () => schema.get(),
			method,
			path: params =>
				joinSegments(
					segments,
					({ param }) => (params as Record<string, string>)[param],
				),
			segments,
			segmentsParams: params,
		};
	}
}

/**
 * Creates a builder with the given initial segments
 *
 * @param segments to initialize the builder with
 * @returns builder for a HttpRoute {@link Definition}
 */
export function builder<const T extends readonly Segment[]>(
	segments: T,
): Builder<T>;
/**
 * Creates a builder with the given path
 *
 * @param path to initialize the builder with
 * @returns builder for a HttpRoute {@link Definition}
 */
export function builder(path: string): Builder<[SegmentPath]>;
/**
 * Creates a builder with the given path or segments
 *
 * @param segments to initialize the builder with
 * @returns builder for a HttpRoute {@link Definition}
 */
export function builder(segments: string | readonly Segment[]) {
	return typeof segments === "string"
		? new Builder([{ path: segments, type: "path" }])
		: new Builder(segments);
}
