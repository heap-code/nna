import * as z from "zod";

import { PRIMARY_KEY, schemaCommon } from "./model.common";

/** Base schema for `Model` with a "string-id". */
export const schema = schemaCommon.extend({
	_id: z.string({ description: "Unique ID defining an entity" }).readonly(),
} satisfies Record<typeof PRIMARY_KEY, unknown>);

/** Extracted type from the `Model` {@link schema schema} */
export type Type = z.infer<typeof schema>;
