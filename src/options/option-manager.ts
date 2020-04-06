/**
 * @packageDocumentation
 * @module Options
 */

import { readFileSync } from "fs";
import { Options } from "typedoc";
import * as Constants from "../constants";
import { getFileExtension } from "../utilities/path-utilities";
import { PluginOptions } from "./models/";
import { OptionValidator } from "./option-validator";

/**
 * Helper class for retrieving and validating plugin options
 */
export class OptionManager { // TODO: Document this
	private _validator: OptionValidator;

	constructor(validator: OptionValidator) {
		this._validator = validator;
	}

	public getPluginOptions(typeDocOptions: Options): PluginOptions {
		const options = this._readPluginOptions(typeDocOptions);

		this._validator.validate(options);

		return options;
	}

	private _readPluginOptions(typeDocOptions: Options): PluginOptions {
		try {
			let pluginOptions = typeDocOptions.getValue(Constants.OPTIONS_NAME);

			if (typeof(pluginOptions) === "string") {
				pluginOptions = this._tryReadOptionsFromFile(pluginOptions);
			}

			if (!pluginOptions) {
				pluginOptions = this._tryReadOptionsFromFile(Constants.DEFAULT_CONFIGURATION_FILE);
			}

			if (!pluginOptions) {
				throw new Error("No options were provided.");
			}

			return pluginOptions;
		} catch (e) {
			throw new Error(`Failed to read plugin options. ${e.message}`);
		}
	}

	private _tryReadOptionsFromFile(path: string): any {
		const ext = getFileExtension(path);

		if (ext === "js") {
			throw new Error("This plugin does not currently support defining configuration files in JavaScript. Use JSON instead.");
		}

		try {
			const fileContents = readFileSync(path, "utf8");

			if (ext === ".json") {
				return JSON.parse(fileContents);
			}
		} catch (e) {
			// Swallow
		}
	}
}
