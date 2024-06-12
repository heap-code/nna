import * as z from "zod";

import { PRIMARY_KEY, schemaCommon } from "./model.common";

/** Base schema for `Model` with a "number-id". */
export const schema = schemaCommon.extend({
	_id: z
		.number({ description: "Unique ID defining an entity" })
		.min(0)
		.readonly(),
} satisfies Record<typeof PRIMARY_KEY, unknown>);

/** Extracted type from the `Model` {@link schema schema} */
export type Type = z.infer<typeof schema>;
