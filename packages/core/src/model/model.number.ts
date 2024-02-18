import * as z from "zod";

import { schemaBase } from "./model.base";

/** Base schema for `Model` with a "number-id". */
export const schema = schemaBase.extend({
	_id: z
		.number({ description: "Unique ID defining an entity" })
		.min(0)
		.readonly(),
});

/** Extracted type from the `Model` [schema]{@link schema} */
export type Type = z.infer<typeof schema>;
