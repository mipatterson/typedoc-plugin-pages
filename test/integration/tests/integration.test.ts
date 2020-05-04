import { DependencyUtilities } from "../utilities";
import { runHtmlVerificationTests } from "./html-verification";
import { runTypeDocExecutionTests } from "./tool-execution";
import { runSearchIntegrationTests } from "./search-integration";

const versions = [
	// Working
	"0.17.6",
	// "0.17.5",
	// "0.17.4",
	// "0.17.3",
	// "0.17.2",
	// "0.17.1",
	// "0.17.0",
	// "0.16.11",
	// "0.16.10",
	// "0.16.9",
	// "0.16.8",
	// "0.16.7",
	// "0.16.6",
	// "0.16.5",
	// Broken
	// "0.8.0",
];

for (const version of versions) {
	describe(`TypeDoc v${version}`, () => {
		beforeAll(() => {
			DependencyUtilities.installTypeDocVersion(version);
		});

		// Run tests
		runTypeDocExecutionTests();
		runHtmlVerificationTests();
		runSearchIntegrationTests(version);
	});
}
