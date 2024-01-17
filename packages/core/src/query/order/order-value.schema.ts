import * as z from "zod";

import { ORDER_VALUES, OrderValue } from "./order-value";

/** The validation schema for {@link OrderValue} */
export const orderValue = z.enum(ORDER_VALUES) satisfies z.ZodType<OrderValue>;
