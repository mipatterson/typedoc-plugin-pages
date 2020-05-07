import { writeFileSync } from "fs";

/**
 * Utility for working with the TypeDoc Pages Plugin
 */
export class PluginUtilities {
	/**
	 * Sets up the Pages Plugin configuration file
	 */
	public static setPluginConfiguration(): void {
		try {
			const configuration = {
				groups: [
					{
						title: "Group One",
						source: "./group-one",
						pages: [
							{
								title: "Page One",
								source: "./page-one.md",
							},
							{
								title: "Page Two",
								source: "./page-two.md",
								children: [
									{
										title: "Child One",
										source: "./page-two/child-one.md",
									},
									{
										title: "Child Two",
										source: "./page-two/child-two.md",
									},
								],
							},
						],
					},
					{
						title: "Group Two",
						source: "./group-two",
						pages: [
							{
								title: "Page Three",
								source: "./page-three.md"
							},
							{
								title: "Section One",
								source: "./section-one",
								groups: [
									{
										title: "Group Three",
										source: "./group-three",
										pages: [
											{
												title: "Section Page One",
												source: "./section-page-one.md"
											},
										],
									},
									{
										title: "Group Four",
										source: "./group-four",
										pages: [
											{
												title: "Section Page Two",
												source: "./section-page-two.md",
												children: [
													{
														title: "Section Child One",
														source: "./section-page-two/section-child-one.md",
													},
												],
											},
											{
												title: "Section Page Three",
												source: "./section-page-three.md",
											},
										],
									},
								],
							},
						],
					},
				],
				listInvalidPageLinks: false,
				output: "pages",
				reflectionNavigationTitle: "Development API",
				replaceGlobalsPage: true,
				source: "./docs"
			};

			this._writeConfigurationFile(configuration);
		} catch (e) {
			throw new Error(`Failed to set plugin configuration. ${e.message}`);
		}
	}

	private static _writeConfigurationFile(configuration: object): void {
		try {
			const configurationString = JSON.stringify(configuration);
			writeFileSync("./test/integration/project/pagesconfig.json", configurationString);
		} catch (e) {
			throw new Error(`Failed to write configuration file. ${e.message}`);
		}
	}
}