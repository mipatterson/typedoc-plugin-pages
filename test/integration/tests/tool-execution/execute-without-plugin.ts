import { pathExists } from "fs-extra";
import { DependencyUtilities, TypeDocUtilities } from "../../utilities";
import { Constants } from "../../constants";

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
			const outputExists = await pathExists(Constants.RELATIVE_OUTPUT_PATH);
			expect(outputExists).toBe(true);
		});
	});
};