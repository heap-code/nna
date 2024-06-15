import { ChildProcess } from "child_process";

/** Use `globalThis` to pass variables to global teardown. */
export interface E2eGlobalThis {
	server: ChildProcess | "use-existing";
}
