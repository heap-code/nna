export default function () {
	// Put clean up logic here (e.g. stopping services, docker-compose, etc.).
	// Hint: `globalThis` is shared between setup and teardown.
	// @ts-expect-error -- FIXME
	console.log(globalThis.__TEARDOWN_MESSAGE__); // eslint-disable-line no-console -- FIXME
}
