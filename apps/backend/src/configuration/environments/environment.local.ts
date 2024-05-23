import { deepmergeCustom } from "deepmerge-ts";

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";
import { MY_ENVIRONMENT } from "../../environment";

/** This export the default environment with local overrides */
export const ENVIRONMENT: Environment = deepmergeCustom({ mergeArrays: false })(
	ENVIRONMENT_DEFAULT,
	MY_ENVIRONMENT as Environment,
);
