import * as z from "zod";

import { Order } from "./order";
import { FilterOptions } from "../filter";
import { QueryObjectSchema } from "../query.types";

/** Options to create a query order validation schema */
export type OrderOptions = Pick<FilterOptions, "strict">;

/**
 *
 * @param schema the object schema to create this order schema
 * @param options for the creation of the schema
 * @returns the order validation schema for the given schema
 */
function _schema<T extends QueryObjectSchema>(
	schema: T,
	options?: OrderOptions,
): z.ZodType<Order<z.infer<T>>> {
	throw new Error("TODO");
}

export { _schema as order };
