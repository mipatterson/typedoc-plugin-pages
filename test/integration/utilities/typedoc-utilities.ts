import { execSync } from "child_process";
import { writeFileSync } from "fs";

/**
 * Utility for working with TypeDoc
 */
export class TypeDocUtilities {
	/**
	 * Executes a TypeDoc build
	 */
	public static runTypeDoc(): void {
		try {
			execSync(`cd ./test/integration/project && npm run doc`);
		} catch (e) {
			throw new Error(`Failed to run TypeDoc. ${e.message}`);
		}
	}

	/**
	 * Sets up the TypeDoc configuration file
	 * @param usePlugin Whether or not to use the Pages Plugin
	 * @param usePluginTheme Whether or not to use the Pages Plugin Theme
	 */
	public static setTypeDocConfiguration(usePlugin: boolean, usePluginTheme: boolean): void {
		try {
			const configuration: any = {
				"listInvalidSymbolLinks": false,
				"name": "TypeDoc Pages Plugin Test Project",
				"out": "./dist",
				"readme": "./docs/README.md",
				"categorizeByGroup": false,
				"plugin": usePlugin ? "typedoc-plugin-pages" : "none",
			};

			if (usePluginTheme) {
				configuration.theme = "pages-plugin";
			}

			this._writeConfigurationFile(configuration);
		} catch (e) {
			throw new Error(`Failed to write test conifg. ${e.message}`);
		}
	}

	private static _writeConfigurationFile(configuration: object): void {
		try {
			const configurationString = JSON.stringify(configuration);
			writeFileSync("./test/integration/project/typedoc.json", configurationString);
		} catch (e) {
			throw new Error(`Failed to write configuration file. ${e.message}`);
		}
	}
}