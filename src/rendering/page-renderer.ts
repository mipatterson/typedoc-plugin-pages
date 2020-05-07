/**
 * @packageDocumentation
 * @module Rendering
 */

import { UrlMapping } from "typedoc";
import { RendererEvent } from "typedoc/dist/lib/output/events";
import { PluginOptions } from "../options/models/";
import { BaseItem, Page, ChildPage, PageSection, PageDictionary, PageGroup } from "../pages/models/";
import { UrlMappingModelPluginMetadata, ModelItemType } from "./plugin-page-url-mapping-model";

/**
 * Generates UrlMappings for pages and page groups so they are rendered as output pages by TypeDoc
 */
export class PageRenderer {
	private _options: PluginOptions;
	private _pages: PageDictionary;

	/**
	 * Creates an instance of PageRenderer.
	 * @param options Plugin options
	 * @param pages Page dictionary
	 */
	constructor(options: PluginOptions, pages: PageDictionary) {
		this._options = options;
		this._pages = pages;
	}

	public addPluginDataToAllPages(event: RendererEvent): void {
		for (const page of event.urls) {
			page.model.pagesPlugin = this._getPluginModelMetadata(false);
		}
	}

	public replaceGlobalsPage(event: RendererEvent): void {
		if (this._options.replaceGlobalsPage) {
			const globals = this._getGlobalsUrlMapping(event);
			const template = this._getTemplateUrlMapping(event);
			this._replaceGlobalsPage(globals, template);
		}
	}

	/**
	 * Adds plugin pages and page groups to the list of UrlMappings so they are rendered by TypeDoc
	 * @param event TypeDoc Renderer begin event
	 */
	public addPluginPagesForRendering(event: RendererEvent): void {
		let pluginUrlMappings: UrlMapping[] = [];

		const template = this._getTemplateUrlMapping(event);

		for (const group of this._pages.all) {
			pluginUrlMappings = [
				...pluginUrlMappings,
				...this._createMappings(group, template),
			];
		}

		// Register the pages so they are rendered
		event.urls = [
			...event.urls,
			...pluginUrlMappings,
		];
	}

	private _getGlobalsUrlMapping(event: RendererEvent): UrlMapping {
		return event.urls.filter((mapping: UrlMapping): boolean => mapping.url === "globals.html")[0];
	}

	/**
	 * Gets an existing UrlMapping to use as a template when building the plugin mappings
	 * @param event TypeDoc Renderer begin event
	 * @returns The tempalate UrlMapping
	 */
	private _getTemplateUrlMapping(event: RendererEvent): UrlMapping {
		return event.urls.filter((mapping: UrlMapping): boolean => mapping.url === "index.html")[0];
	}

	/**
	 * Recursively creates UrlMappings for the provided item and all of its sub items
	 * @param item Page, child page, page group, or page section to generate a mapping for
	 * @param template Template mapping
	 * @param parentModel The parent object's model (if there is a parent object)
	 * @returns An array of generate UrlMappings for the item and its sub items
	 */
	private _createMappings(item: BaseItem, template: UrlMapping, parentModel?: any): UrlMapping[] {
		let mappings: UrlMapping[] = [];
	
		const itemMapping = this._createUrlMapping(template, item, parentModel);
		mappings.push(itemMapping);
	
		if (item instanceof PageGroup) {
			for (const page of item.pages) {
				mappings = mappings.concat(this._createMappings(page, template, itemMapping.model));
			}
		} else if (item instanceof Page) {
			for (const child of item.children) {
				mappings = mappings.concat(this._createMappings(child, template, itemMapping.model));
			}
		} else if (item instanceof PageSection) {
			for (const group of item.groups) {
				mappings = mappings.concat(this._createMappings(group, template, itemMapping.model));
			}
		}
	
		return mappings;
	}

	/**
	 * Creates a UrlMapping for the provided item
	 * @param templateMapping Template mapping to use
	 * @param item Item to generate the mapping for
	 * @param parentModel Parent object's model (If there is no parent, the template mapping's model will be used.)
	 * @returns The created mapping
	 */
	private _createUrlMapping(templateMapping: UrlMapping, item: BaseItem, parentModel?: any): UrlMapping {
		const model: any = {};
	
		// Copy properties from template
		for (const prop in templateMapping) {
			if (templateMapping.hasOwnProperty(prop)) {
				model[prop] = templateMapping[prop];
			}
		}
	
		model.parent = parentModel || templateMapping.model;
		model.url = item.url;
		model.name = item.title;
	
		if (item instanceof Page) {
			model.pagesPlugin = this._getPluginModelMetadata(true, item, ModelItemType.Page);
		} else if (item instanceof ChildPage) {
			model.pagesPlugin = this._getPluginModelMetadata(true, item, ModelItemType.ChildPage);
		} else if (item instanceof PageGroup) {
			const group = item as PageGroup;
			model.pagesPlugin = this._getPluginModelMetadata(true, item, ModelItemType.Group);
			if (group.pages.length > 0) {
				model.url = group.pages[0].url;
			}
		} else if (item instanceof PageSection) {
			const section = item as PageSection;
			model.pagesPlugin = this._getPluginModelMetadata(true, item, ModelItemType.Section);
			if (section.groups.length > 0) {
				model.url = section.groups[0].pages[0].url;
			}
		}

		return new UrlMapping(model.url, model, "markdown-page.hbs"); // TODO: make this configuraable
	}

	private _replaceGlobalsPage(globalsMapping: UrlMapping, templateMapping: UrlMapping): void {
		globalsMapping.url = templateMapping.url;
		globalsMapping.model.url = templateMapping.url;
	}

	private _getPluginModelMetadata(isPluginItem: boolean, item?: BaseItem, type?: ModelItemType): UrlMappingModelPluginMetadata {
		return {
			isPluginItem: isPluginItem,
			item,
			options: {
				replaceGlobalsPage: this._options.replaceGlobalsPage,
			},
			type,
		};
	}
}
