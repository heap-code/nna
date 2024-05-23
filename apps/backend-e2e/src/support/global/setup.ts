let __TEARDOWN_MESSAGE__: string;

export default function () {
	// Start services that the app needs to run (e.g. database, docker-compose, etc.).
	// eslint-disable-next-line no-console -- FIXME
	console.log("\nSetting up...\n");

	// Hint: Use `globalThis` to pass variables to global teardown.
	// @ts-expect-error -- FIXME
	globalThis.__TEARDOWN_MESSAGE__ = "\nTearing down...\n";
}
