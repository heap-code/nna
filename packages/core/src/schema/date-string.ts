import * as z from "zod";

/**
 * Base schema for date string that already transforms into a `Date` instance.
 *
 * A `.pipe` can be added after to define date constraints (max, min, ...).
 * It also works with `nullable`.
 *
 * @example
 * dateString.nullable().pipe(z.date().min(...))
 */
export const dateString = z.iso.datetime().transform(arg => new Date(arg));
