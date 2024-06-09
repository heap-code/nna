import { Param } from "./param";
import { KeepInArrayWhen } from "../../types";

interface SegmentBase<T extends string> {
	/** Type of segment for the route definition */
	type: T;
}

type SegmentParamBase = SegmentBase<"param">;
/** A segment being a parameter in the path (e.g. `/users/:id`) */
export type SegmentParam = Param & SegmentParamBase;

/** A segment with simply a string path */
export interface SegmentPath extends SegmentBase<"path"> {
	/** segment for the URI path (can contain '/') */
	path: string;
}

/** A segment being part of a route definition */
export type Segment = SegmentParam | SegmentPath;

/** Keep from Array Segment the ones that are parameters */
export type ExtractSegmentParams<SEGMENTS extends readonly Segment[]> =
	KeepInArrayWhen<SEGMENTS, SegmentParamBase>;

/**
 * Determines if a {@link Segment} is a {@link SegmentParam}.
 *
 * @param segment to test
 * @returns if the {@link segment} is a {@link SegmentParam}
 */
export function isSegmentParam(segment: Segment): segment is SegmentParam {
	return segment.type === "param";
}

/**
 * Extracts only the parameters from the segments.
 *
 * @param segments to extract params from
 * @returns the {@link SegmentParam} from the param
 */
export function extractSegmentParams<const SEGMENTS extends readonly Segment[]>(
	segments: SEGMENTS,
): ExtractSegmentParams<SEGMENTS> {
	return segments.filter(isSegmentParam) as never;
}

/**
 * Join route segments to creates a path
 *
 * @param segments to join
 * @param transform a segment parameter
 * @returns a path
 */
export function joinSegments(
	segments: readonly Segment[],
	transform: (param: SegmentParam) => string,
): string {
	const path = segments.map(segment =>
		isSegmentParam(segment)
			? transform(segment)
			: segment.path.replace(/^\/+|\/+$/g, ""),
	);

	const sep = "/";
	return sep + path.join(sep);
}
