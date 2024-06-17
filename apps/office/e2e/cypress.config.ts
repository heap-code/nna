import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset";
import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		...(nxE2EPreset(__filename, {
			cypressDir: "src",
		}) as Cypress.EndToEndConfigOptions),
		baseUrl: "http://localhost:35200",
		video: true,
		videoCompression: true,
	},
	experimentalStudio: true,
	video: true,
	videoCompression: true,
});
