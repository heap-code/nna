import { E2eGlobalThis } from "./e2e.global-this";

export default function () {
	const e2eGlobalThis = globalThis as unknown as E2eGlobalThis;

	if (e2eGlobalThis.server !== "use-existing") {
		e2eGlobalThis.server.kill();
	}
}
