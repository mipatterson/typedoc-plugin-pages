import { execSync } from "child_process";
import { copySync } from "fs-extra";

/**
 * Utility for managing dependencies of the integration test project
 */
export class DependencyUtilities {
	/**
	 * Installs a specific version of TypeDoc
	 * @param version TypeDoc version to install
	 */
	public static installTypeDocVersion(version: string): void {
		try {
			execSync(`cd ./test/integration/project && npm install typedoc@${version}`);
		} catch (e) {
			throw new Error(`Failed to install TypeDoc version ${version}. ${e.message}`);
		}
	}

	/**
	 * Installs the TypeDoc Pages Plugin from source
	 */
	public static installPagesPlugin(): void {
		try {
			execSync(`cd ./test/integration/project && npm run clean:plugin`);
			copySync("./dist", "./test/integration/project/node_modules/typedoc-plugin-pages/dist/");
			copySync("package.json", "./test/integration/project/node_modules/typedoc-plugin-pages/package.json");
		} catch (e) {
			throw new Error(`Failed to install TypeDoc Pages Plugin. ${e.message}`);
		}
	}

	/**
	 * Uninstalls the TypeDoc Pages Plugin
	 */
	public static uninstallPagesPlugin(): void {
		try {
			execSync(`cd ./test/integration/project && npm run clean:plugin`);
		} catch (e) {
			throw new Error(`Failed to uninstall TypeDoc Pages Plugin. ${e.message}`);
		}
	}
}