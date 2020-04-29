/**
 * @packageDocumentation
 * @module Theme
 */

import * as compareVersions from "compare-versions";
import { join } from "path";
import { DefaultTheme, Options, Renderer } from "typedoc";
import { THEME_NAME } from "../constants";

/**
 * Class for managing the TypeDoc theme
 */
export class ThemeManager {
	private readonly _typedocVersion: string;

	/**
	 * Creates a new instance of ThemeManager
	 * @param typedocVersion TypeDoc version
	 */
	constructor(typedocVersion: string) {
		this._typedocVersion = typedocVersion;
	}

	/**
	 * Applies the plugin theme, based on the TypeDoc theme option
	 *
	 * @param renderer TypeDoc renderer
	 * @param options TypeDoc options
	 */
	public applyTheme(renderer: Renderer, options: Options): void {
		const themePath = join(__dirname, "../..", "theme", compareVersions(this._typedocVersion, "0.17.4") >= 0 ? "v2" : "v1");

		// Get the TypeDoc "theme" option
		const themeOption = options.getValue("theme");

		// If the user specified the plugin theme, apply it
		if (themeOption === THEME_NAME) {
			const pluginTheme = new DefaultTheme(renderer, themePath);
			renderer.theme = renderer.addComponent("theme", pluginTheme);
		}
	}
}
