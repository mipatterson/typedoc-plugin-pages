const merge = require("merge");
const ts_preset = require("ts-jest/jest-preset");

module.exports = merge.recursive(ts_preset, {
	collectCoverage: false,
	displayName: "Integration Tests",
	errorOnDeprecated: true,
	"reporters": [
		"default",
		["jest-html-reporters", {
			"publicPath": "./artifacts",
			"filename": "integration-test-report.html",
			"expand": true,
			pageTitle: "TypeDoc Pages Plugin Integration Tests",
		}],
	],
	testRegex: "./test/integration/tests/.*.test.ts"
});