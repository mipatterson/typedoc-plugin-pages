/**
 * @packageDocumentation
 * @module Plugin
 */

import { Application } from "typedoc/dist/lib/application";
import { OPTIONS_NAME, PLUGIN_NAME } from "./constants";
import { ParameterType } from "typedoc/dist/lib/utils/options/declaration";
import { PagesPlugin } from "./plugin";

export = (PluginHost: Application): void => {
	const app = PluginHost.owner;

	// Register options
	app.options.addDeclaration({
		help: "Pages Plugin: Pages Plugin configuration or the path to the pages configuration file",
		name: OPTIONS_NAME,
		type: ParameterType.Mixed,
	});

	// Register components
	app.renderer.addComponent(PLUGIN_NAME, new PagesPlugin(app.renderer));
};