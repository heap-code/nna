import { Schemas } from "@nna/core";
import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset";
import { defineConfig } from "cypress";
import * as z from "zod";

// TODO: a way to get these from configuration (or the build being tested)?
const E2E_API = z
	.string()
	.default("http://localhost:33000/e2e/api")
	.parse(process.env.FE_E2E_API_URL);

// Only the mail-hog client information
const MAIL_HOST = z
	.string()
	.min(1)
	.default("localhost")
	.parse(process.env.E2E_MAIL_HOST || process.env.BE_MAIL_HOST);
const MAIL_PORT = Schemas.port(z.coerce.number())
	.default(8025)
	.parse(process.env.E2E_MAIL_PORT);

const MAIL_HOG_URL = `http://${MAIL_HOST}:${MAIL_PORT}`;

export default defineConfig({
	e2e: {
		...(nxE2EPreset(__filename, {
			cypressDir: "src",
		}) as Cypress.EndToEndConfigOptions),
		baseUrl: "http://localhost:35200",
		video: true,
		videoCompression: true,
	},
	env: { E2E_API, MAIL_HOG_URL },
	experimentalStudio: true,
	video: true,
	videoCompression: true,
	viewportHeight: 1080,
	viewportWidth: 1280,
});
