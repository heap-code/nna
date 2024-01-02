import { z } from "zod";

import { FilterObject } from "./filter-object";
import {
	getFilterValueFromZodEqType,
	isZodSchemaFilterEqType,
} from "./filter-value.schema";

export interface CreateFilterObjectSchemaOptions {
	// TODO
	strict?: boolean;
}

/**
 * TODO
 *
 * @param schema
 * @param options
 */
export function createFilterObjectSchema<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	options?: CreateFilterObjectSchemaOptions,
) {
	const fn = (schema: z.ZodTypeAny): z.ZodType | null => {
		if (isZodSchemaFilterEqType(schema)) {
			return getFilterValueFromZodEqType(schema);
		}

		const y = schema as z.ZodArray<z.ZodTypeAny> | z.ZodObject<never>;
		if (y._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
			return z.lazy(() => createFilterObjectSchema(y as never, options));
		}

		const f = y._def;
		if (f.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
			return z.lazy(() => {
				const t = fn(f.type);
				return t ? t : z.never();
			});
		}

		//console.log(schema);
		return null;
	};

	const y = Object.entries(schema.shape).map(([key, schema]) => {
		return [key, fn(schema)];
	});

	const x = Object.fromEntries(
		y.filter(([, schema]) => schema !== null) as never,
	);
	//console.log(x);
	return z.object(x).partial() satisfies z.ZodType<FilterObject<z.infer<T>>>;
}
