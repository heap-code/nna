import { z } from "zod";

import { groupSchema } from "./group.schema";

export type GroupModel = z.infer<typeof groupSchema>;
