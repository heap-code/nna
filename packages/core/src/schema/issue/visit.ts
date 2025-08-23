import * as z from "zod";

/** The issue type managed by the {@link Visitor} */
export type Issue = z.core.$ZodIssue;

/** Visitor of {@link Issue issues} with its "handlers" */
export type Visitor<T> = {
	/** handler of the visitor */
	[K in Issue["code"]]: (issue: Extract<Issue, { code: K }>) => T;
};

/** @internal */
interface VisitResultBase<T extends boolean> {
	/** Has the issue been visited by the visitor */
	visited: T;
}
/** Result of a {@link visit} when a visitor did not handle/visit the {@link Issue} */
export type VisitResultUnvisited = VisitResultBase<false>;
/** Result of a {@link visit} when a visitor did handle/visit the {@link Issue} */
export interface VisitResultVisited<T> extends VisitResultBase<true> {
	/** Data returned by the visitor's handler */
	data: T;
}
/** Result of a {@link visit} from a {@link Visitor} */
export type VisitResult<T> = VisitResultUnvisited | VisitResultVisited<T>;

/**
 * Visits an issue with a partial visitor
 *
 * @param issue to visit
 * @param visitor for the given {@link issue}
 * @returns the results of the visit
 */
export function visit<T>(
	issue: Issue,
	visitor: Partial<Visitor<T>>,
): VisitResult<T> {
	const handler = visitor[issue.code];
	return handler
		? { data: handler(issue as never), visited: true }
		: { visited: false };
}

/**
 * Visits an issue with a partial visitor
 * Uses the default provided handler when the "visitor do not visit"
 *
 * @param issue to visit
 * @param fallback default fallback when none of visitor's handlers have "seen" the {@link issue}
 * @param visitor for the given {@link issue}
 * @returns the data from the handlers
 */
export function visitWithFallback<T>(
	issue: Issue,
	fallback: (issue: Issue) => T,
	visitor: Partial<Visitor<T>>,
) {
	const result = visit(issue, visitor);
	return result.visited ? result.data : fallback(issue as never);
}

// TODO: the nested issue (e.g. string : [email, uuid, ...])
