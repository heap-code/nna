// /!\ Do not modify this file to change the environment.
// Use the [file replacements]{@link https://nx.dev/recipes/webpack/webpack-plugins#filereplacements} feature instead (in `project.json`).
// It is currently replaced by `.local` on local.

// The exported variable must be named `ENVIRONMENT`

import { ENVIRONMENT_DEFAULT } from "./environment.default";
import { Environment } from "./environment.interface";

export const ENVIRONMENT: Environment = ENVIRONMENT_DEFAULT;
