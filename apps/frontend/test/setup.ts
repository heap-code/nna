import "jest-preset-angular/setup-jest";

import { TestBed } from "@angular/core/testing";

TestBed.configureTestingModule({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
	teardown: { destroyAfterEach: true },

	// TODO: default imports
});
