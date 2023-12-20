// @ts-expect-error -- TODO https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
import "jest-preset-angular/setup-jest";

globalThis.ngJest = {
	testEnvironmentOptions: {
		errorOnUnknownElements: true,
		errorOnUnknownProperties: true,
	},
};
