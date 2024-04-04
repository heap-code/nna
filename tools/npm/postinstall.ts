import * as fs from "fs";
import * as path from "path";

/**
 * Run the npm postinstall command
 */
(() => {
	const pathRoot = path.join(__dirname, "../../");
	const pathApps = path.join(pathRoot, "apps");
	const pathBack = path.join(pathApps, "backend");

	const envPath = path.join(pathBack, "src/environment.ts");
	if (!fs.existsSync(envPath)) {
		fs.copyFileSync(
			path.join(
				pathBack,
				"src",
				"configuration",
				"environments",
				"environment.ts.tpl",
			),
			envPath,
		);
	}
})();
