import * as z from "zod";

import { schema as successSchema } from "./auth.success.dto";

// TODO
export const schema = successSchema.pick({ expireOn: true, issuedAt: true });

export type Dto = z.infer<typeof schema>;
