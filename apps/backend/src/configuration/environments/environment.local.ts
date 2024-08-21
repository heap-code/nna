import { deepmergeCustom } from "deepmerge-ts";
import { PartialDeep } from "type-fest";

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";
import { MY_ENVIRONMENT } from "../../environment";

/** This export the default environment with local overrides */
export const ENVIRONMENT: Environment = deepmergeCustom({ mergeArrays: false })(
	ENVIRONMENT_DEFAULT,
	{ swagger: true } satisfies PartialDeep<Environment>,
	MY_ENVIRONMENT as Environment,
);
