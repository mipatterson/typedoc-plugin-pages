/**
 * @packageDocumentation
 * @module Theme
 */

import { join } from "path";
import { DefaultTheme, Options, Renderer } from "typedoc";
import { THEME_NAME } from "../constants";

/**
 * Class for managing the TypeDoc theme
 */
export class ThemeManager {
	/**
	 * Applies the plugin theme, based on the TypeDoc theme option
	 *
	 * @param renderer TypeDoc renderer
	 * @param options TypeDoc options
	 */
	public applyTheme(renderer: Renderer, options: Options): void {
		const themePath = join(__dirname, "../..", "theme");

		// Get the TypeDoc "theme" option
		const themeOption = options.getValue("theme");

		// If the user specified the plugin theme, apply it
		if (themeOption === THEME_NAME) {
			const pluginTheme = new DefaultTheme(renderer, themePath);
			renderer.theme = renderer.addComponent("theme", pluginTheme);
		}
	}
}
