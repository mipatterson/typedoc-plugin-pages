import { runNavigationHtmlVerificationTests } from "./navigation-html-verification";
import { runPageLinkHtmlVerificationTests } from "./page-link-html-verification";

export const runHtmlVerificationTests = (): void => {
	describe("HTML Verification", () => {
		runNavigationHtmlVerificationTests();
		runPageLinkHtmlVerificationTests();
	});
};