// /!\ Do not modify this file to change the environment.
// Use the [file replacements]{@link https://nx.dev/recipes/webpack/webpack-plugins#filereplacements} feature instead (in `project.json`).
// The exported variable must be named `ENVIRONMENT`

import { deepmerge } from "deepmerge-ts";

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";
import { MY_ENVIRONMENT } from "../../environment";

/** This only export the default environment with local overrides as the environment. */
export const ENVIRONMENT: Environment = deepmerge(
	ENVIRONMENT_DEFAULT,
	MY_ENVIRONMENT as Environment,
);
