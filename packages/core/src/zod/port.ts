import * as z from "zod";

/** Maximum port value */
export const PORT_MAX_VALUE = 65535;

/** Options for the {@link port} schema */
export interface PortOptions {
	/**
	 * Allow the 0 port (dynamic port)?
	 *
	 * @default false
	 */
	allowZero?: boolean;
}

/**
 * From a given schema, add constraints for a valid port number
 *
 * @param schema base to apply constraints
 * @param options for the resulted schema
 * @returns a schema (from the given on) with port constraint
 */
export function port<T extends z.ZodNumber>(
	schema: T,
	options: PortOptions = {},
) {
	return schema.min(options.allowZero ? 0 : 1).max(PORT_MAX_VALUE);
}
