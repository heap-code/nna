import * as z from "zod";

import type { EnumSchema } from "./enum";
import type { NestedType } from "../../../zod";
import type { FilterValue, FilterValueOperatorMap } from "../filter-value";

/** Zod schema for FilterValue ordernable type */
export type FilterZodOrdType =
	| EnumSchema
	| z.ZodBoolean
	| z.ZodDate
	| z.ZodNumber
	| z.ZodString;

/** Zod schema for FilterValue comparable type */
export type FilterZodEqType = NestedType<FilterZodOrdType>;

/**
 * Creates a validation schema for a value query filter operators
 *
 * @param ordType type that can be ordered (>, >=, <, <=)
 * @param eqType type that can be compared (==, !=)
 * @returns the validation schema
 */
function schemaOperatorMap<
	T extends FilterZodOrdType,
	U extends FilterZodEqType = T,
>(ordType: T, eqType: U) {
	// FIXME: The output type is wrongly determined if the `satisfies` is put directly on this object
	const schema = {
		$eq: eqType,
		$ne: eqType,

		$gt: ordType,
		$gte: ordType,
		$lt: ordType,
		$lte: ordType,

		$in: z.array(eqType),
		$nin: z.array(eqType),

		$exists: z.boolean(),

		/**
		 * Search for records whose value match the given text.
		 *
		 * It works correctly only to indexed properties.
		 */
		$fulltext: z.string(),
		$like: z.string(),
		$re: z.string(),
	};

	return z
		.object(
			schema satisfies Record<
				keyof FilterValueOperatorMap<unknown>,
				z.ZodType
			>,
		)
		.partial();
}

/** Options to create a "value" filter validation schema */
export interface SchemaOptions {
	/**
	 * Convert ordenable type, e.g. for `number`: `"12" => 12`.
	 *
	 * Take note that it mainly uses Javascript cast (except for `boolean`).
	 * That means, e.g.
	 * 	- for a non-nullable number, `null` => `0` (=== `Number(null)`).
	 *  - for a non-nullable string, `null` => `"null"` (=== `String(null)`).
	 * For a nullable type, `"null"` => `null`
	 *
	 * `boolean` is only converted from `"false"` and `"true"`.
	 *
	 * /!\ Note that a nullable `string` with the this option will results on `"null"` strings to be casted to `null` on "eq"-keys (`$eq`, `$ne`, `$in` and `$nin`).
	 * Comparison keys can be used to force the `"null"` string search (`${$gte: "null", $lte: "null"}`) or use the `$like` operator
	 *
	 * @default false
	 */
	coerce?: boolean;
	/**
	 * Is `null` a valid value
	 *
	 * @default false
	 */
	nullable?: boolean;
	/**
	 * Raise error when there is unknown keys
	 *
	 * @default false
	 */
	strict?: boolean;
}

export type SchemaOptionsNullable = Record<
	keyof Pick<SchemaOptions, "nullable">,
	true
>;

/**
 * Creates a validation schema for (mostly primitive like) nullable type
 *
 * @param ordType type that can be ordered (>, >=, <, <=).
 * Some coerce options must be set before receiving this parameter.
 * @param options for the creation of the schema
 * @returns the validation schema
 */
export function schema<T extends FilterZodOrdType>(
	ordType: T,
	options: SchemaOptions & SchemaOptionsNullable,
): z.ZodType<FilterValue<z.infer<T> | null>>;
/**
 * Creates a validation schema for (mostly primitive like) type
 *
 * @param ordType type that can be ordered (>, >=, <, <=).
 * Some coerce options must be set before receiving this parameter.
 * @param options for the creation of the schema
 * @returns the validation schema
 */
export function schema<T extends FilterZodOrdType>(
	ordType: T,
	options: SchemaOptions,
): z.ZodType<FilterValue<z.infer<T>>>;

/**
 * Creates a validation schema for (mostly primitive like) type
 *
 * @param ordType type that can be ordered (>, >=, <, <=).
 * Some coerce options must be set before receiving this parameter.
 * @param options for the creation of the schema
 * @returns the validation schema
 */
export function schema<T extends FilterZodOrdType>(
	ordType: T,
	options: SchemaOptions,
) {
	// TODO (FilterValue-singleton): a singleton for each primitive (expect enum) with theirs options for performance?
	const { coerce, nullable, strict } = options;

	const eqType: FilterZodEqType = (() => {
		if (!nullable) {
			return ordType;
		}

		const type = ordType.nullable();
		if (!coerce) {
			return type;
		}

		return z
			.custom<z.infer<T>>()
			.transform<z.infer<T> | null>(val => (val === "null" ? null : val))
			.pipe(type) as never;
	})();

	const operatorsBase = schemaOperatorMap(ordType, eqType);
	const operators = strict ? operatorsBase.strict() : operatorsBase;

	return z.custom().transform((val, ctx) => {
		// Verifies if it is an operators filter
		const opResults = operators.safeParse(val);
		if (opResults.success) {
			return opResults.data;
		}

		// Verifies if it is a primitive
		const prResults = eqType.safeParse(val);
		if (prResults.success) {
			return prResults.data;
		}

		// If both are wrong, add the errors for the "more precise" validation.
		//	e.g. for a `number` filter:
		//	- for the value `"abc"`, get a message "expected 'number', got 'string'" instead of a "expected 'object', got 'string'"
		//	- for the value `{$eq: "abc"}`, get a message "expected 'number', got 'string' for path '$eq'" instead of a "expected 'number', got 'object'"
		// This is used to "flatten" Zod errors; with unions, Zod put both kind of errors under a common 'unionError'

		const { issues } = z.object({}).safeParse(val).success
			? opResults.error
			: prResults.error;
		for (const issue of issues) {
			ctx.addIssue(issue);
		}

		// Not important as issues are added
		return val;
	});
}
