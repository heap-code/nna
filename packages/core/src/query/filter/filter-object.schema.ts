import { z } from "zod";

import { FilterObject } from "./filter-object";
import * as FilterValue from "./filter-value.schema";

export type ObjectOptions = FilterValue.ValueOptions;

/**
 * TODO
 *
 * @param schema
 * @param options
 */
function schema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: ObjectOptions,
) {
	// TODO
	const fn = (schema: z.ZodTypeAny): z.ZodType | null => {
		if (FilterValue.isFilterValueConvertible(schema)) {
			return FilterValue.value(schema, options);
		}

		const y = schema as z.ZodArray<z.ZodTypeAny> | z.ZodObject<never>;
		if (y._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
			return z.lazy(() => schema(y as never, options));
		}

		const f = y._def;
		if (f.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
			return z.lazy(() => {
				const t = fn(f.type);
				return t ? t : z.never();
			});
		}

		return null;
	};

	const x = Object.fromEntries(
		Object.entries(schema.shape)
			.map(([key, schema]) => {
				return [key, fn(schema)];
			})
			.filter(([, schema]) => schema !== null) as never,
	);
	return z.object(x).partial() satisfies z.ZodType<FilterObject<z.infer<T>>>;
}

export { schema as object };
