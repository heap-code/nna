import * as z from "zod";

/** The discriminated key of a source */
export const PAYLOAD_SOURCE_KEY = "type";
/**
 * Base for any source
 *
 * @param value for the discriminated key
 * @returns base of the schema
 */
function payloadSourceBaseSchema<T extends string>(value: T) {
	return z.object({ [PAYLOAD_SOURCE_KEY]: z.literal(value) }).strip();
}

/** Schema for {@link PayloadSourceLocal} */
export const payloadSourceLocalSchema = payloadSourceBaseSchema("local");
/** When the user logged in with local credentials */
export type PayloadSourceLocal = z.infer<typeof payloadSourceLocalSchema>;

/** Schema for {@link PayloadSource} */
export const payloadSourceSchema = z.discriminatedUnion(PAYLOAD_SOURCE_KEY, [
	payloadSourceLocalSchema,
	// Use different sources for other auth strategies
	//	- 3rd party (Google, Facebook, Microsoft, ...)
	//	- Special API key
	//	- ...
]);
/** Source of a JWT payload (what was used to login) */
export type PayloadSource = z.infer<typeof payloadSourceSchema>;
/** Union of possible source types */
export type PayloadSourceType = PayloadSource[typeof PAYLOAD_SOURCE_KEY];
