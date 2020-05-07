/**
 * @packageDocumentation
 * @module Rendering
 */


import { BaseItem } from "../pages/models/";

// TODO: Document this
export enum ModelItemType {
	Page = "page",
	ChildPage = "childpage",
	Group = "group",
	Section = "section",
}

export interface UrlMappingModelPluginMetadata {
	isPluginItem: boolean;
	item?: BaseItem;
	options: {
		replaceGlobalsPage: boolean;
	};
	type?: ModelItemType;
}

// TODO: Document this
export interface PluginPageUrlMappingModel {
	[key: string]: any;
	pagesPlugin: UrlMappingModelPluginMetadata;
}
