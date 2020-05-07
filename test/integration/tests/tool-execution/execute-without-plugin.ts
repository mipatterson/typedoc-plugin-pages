import { pathExists } from "fs-extra";
import { buildHTMLOutputPath } from "../../helpers/html-output-path-helpers";
import { DependencyUtilities, TypeDocUtilities } from "../../utilities";

export const executeTypeDocWithoutPlugin = (): void => {
	describe("TypeDoc (no plugin)", () => {
		beforeAll(() => {
			DependencyUtilities.uninstallPagesPlugin();
			TypeDocUtilities.setTypeDocConfiguration(false, false);
		});

		test("runs to completion", async () => {
			TypeDocUtilities.runTypeDoc();
		});

		test("generates output", async () => {
			const outputExists = await pathExists(buildHTMLOutputPath("index.html"));
			expect(outputExists).toBe(true);
		});
	});
};