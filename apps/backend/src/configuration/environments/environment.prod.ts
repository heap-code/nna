import { deepmergeCustom } from "deepmerge-ts";
import type { PartialDeep } from "type-fest";

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";

/** The prod environment */
const ENVIRONMENT_PROD: PartialDeep<Environment> = {
	host: {
		cors: {
			origin: [
				// TODO
			],
		},
	},
	logger: true,
};

/** This export the default environment with prod overrides */
export const ENVIRONMENT: Environment = deepmergeCustom({
	mergeArrays: false,
})(ENVIRONMENT_DEFAULT, ENVIRONMENT_PROD as Environment);
