import * as z from "zod";

import { schemaBase } from "./model.base";

/** Base schema for `Model` with a "string-id". */
export const schema = schemaBase.extend({
	_id: z.string({ description: "Unique ID defining an entity" }).readonly(),
});

/** Extracted type from the `Model` [schema]{@link schema} */
export type Type = z.infer<typeof schema>;
