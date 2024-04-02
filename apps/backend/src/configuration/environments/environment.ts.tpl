import type { PartialDeep } from "type-fest";

import type { Environment } from "./configuration/environments";

/**
 * Your environment, for local purpose.
 *
 * Do not worry this file is ignored in other builds
 * and not even tracked by git.
 *
 * Take a look at [environment.default.ts](./configuration/environments/environment.default.ts)
 * which already allows replacements with ENV variables.
 */
export const MY_ENVIRONMENT: PartialDeep<Environment> = {};
