import * as z from "zod";

import { schema as successSchema } from "./auth.success.dto";
import { userDtoSchema } from "../../user";

/** Validation schema for {@link Dto} */
export const schema = successSchema
	.pick({ expireOn: true, issuedAt: true })
	.extend({ user: userDtoSchema });

export type Dto = z.infer<typeof schema>;
