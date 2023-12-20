export default {
	coverageDirectory: "../../coverage/packages/nest",
	displayName: "nest",
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{ tsconfig: "<rootDir>/tsconfig.spec.json" },
		],
	},
};
