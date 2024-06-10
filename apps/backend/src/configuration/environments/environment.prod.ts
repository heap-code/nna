import { deepmergeCustom } from "deepmerge-ts";
import type { PartialDeep } from "type-fest";

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";

/** The prod environment */
const ENVIRONMENT_PROD: PartialDeep<Environment> = {
	auth: { cookie: { secure: true } },
	host: {
		cors: {
			origin: [
				// TODO
			],
		},
	},
	logger: "pino",
};

/** This export the default environment with prod overrides */
export const ENVIRONMENT: Environment = deepmergeCustom({
	mergeArrays: false,
})(ENVIRONMENT_DEFAULT, ENVIRONMENT_PROD as Environment);
