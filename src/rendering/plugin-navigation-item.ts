/**
 * @packageDocumentation
 * @module Rendering
 */

import { NavigationItem } from "typedoc";

// TODO: Document this
export interface PluginNavigationItem extends NavigationItem {
	isPluginItem?: boolean;
	isReflectionNavigationTitle?: boolean;
}
