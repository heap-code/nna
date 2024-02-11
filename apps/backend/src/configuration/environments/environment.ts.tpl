import type { PartialDeep } from "type-fest";

import type { Environment } from "./configuration/environments";

/**
 * Your environment, for local purpose.
 *
 * Do not worry this file is ignored in other builds
 * and not even tracked by git.
 */
export const MY_ENVIRONMENT: PartialDeep<Environment> = {};
