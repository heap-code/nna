import { spawn } from "child_process";
import waitPort from "wait-port";

import { E2eGlobalThis } from "./e2e.global-this";

/** Possible override from env shell for e2e testing */
export interface EnvironmentShellDefault {
	/** Set `true` to not start a e2e instance */
	BE_E2E_USE_EXISTING?: "true";
}

/** The environment typed */
const env = process.env as EnvironmentShellDefault;

export default async function () {
	const e2eGlobalThis = globalThis as unknown as E2eGlobalThis;

	if (env.BE_E2E_USE_EXISTING === "true") {
		e2eGlobalThis.server = "use-existing";
	} else {
		const server = spawn("npm", ["run", "backend:start:e2e"]);
		for (const steam of [server.stderr, server.stdout]) {
			steam.on("data", (data: Buffer) =>
				// eslint-disable-next-line no-console -- forward logs
				console.debug("💉 backend-e2e 🧪 |", data.toString()),
			);
		}

		e2eGlobalThis.server = server;
	}

	const { open } = await waitPort({
		host: "127.0.0.1",
		port: 33000,
		timeout: 30 * 1000 /* 30 sec */,
	});
	if (!open) {
		throw new Error("E2E instance has not been detected");
	}
}
