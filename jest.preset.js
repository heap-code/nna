const nxPreset = require("@nx/jest/preset").default;

/**
 * @type {import("jest").Config}
 */
module.exports = {
	...nxPreset,
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname",
	],
};
