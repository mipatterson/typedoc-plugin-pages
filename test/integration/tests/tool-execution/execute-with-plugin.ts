import { pathExists } from "fs-extra";
import { buildHTMLOutputPath } from "../../helpers/html-output-path-helpers";
import { DependencyUtilities, PluginUtilities, TypeDocUtilities } from "../../utilities";

export const executeTypeDocWithPlugin = (): void => {
	describe("TypeDoc (with Pages Plugin)", () => {
		beforeAll(() => {
			DependencyUtilities.installPagesPlugin();
			TypeDocUtilities.setTypeDocConfiguration(true, true);
			PluginUtilities.setPluginConfiguration();
		});

		test("runs to completion", async () => {
			TypeDocUtilities.runTypeDoc();
		});

		test("generates output", async () => {
			const expectFileToExist = async (relativePath: string): Promise<void> => {
				const exists = await pathExists(buildHTMLOutputPath(relativePath));
				expect(exists).toBe(true);
			};

			const expectFilesToExist = async (relativePaths: string[]): Promise<void> => {
				for (const relativePath of relativePaths) {
					await expectFileToExist(relativePath);
				}
			};

			await expectFilesToExist([
				"./index.html",
				"./pages/Group One/page-one.html",
				"./pages/Group One/page-two.html",
				"./pages/Group One/page-two/child-one.html",
				"./pages/Group One/page-two/child-two.html",
			]);
		});
	});
};