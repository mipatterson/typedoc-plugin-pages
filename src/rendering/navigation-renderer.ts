/**
 * @packageDocumentation
 * @module Rendering
 */

import { PageEvent } from "typedoc/dist/lib/output/events";
import { PluginOptions } from "../options/models/";
import { BaseItem, ChildPage, Page, PageDictionary, PageGroup, PageSection } from "../pages/models/";
import { NavigationItemFactory } from "./navigation-item-factory";
import { PluginPageUrlMappingModel, ModelItemType } from "./plugin-page-url-mapping-model";
import { PluginNavigationItem } from "./plugin-navigation-item";

/**
 * Handles the rendering of items in the navigation sidebar
 */
export class NavigationRenderer {
	private _itemFactory: NavigationItemFactory;
	private _hasAddedStandardNavigationTitle: boolean;
	private _options: PluginOptions;
	private _pages: PageDictionary;

	/**
	 * Creates an instance of NavigationRenderer
	 * @param options Plugin options
	 * @param pages Page dictionary
	 * @param itemFactory Navigation item factory
	 */
	constructor(options: PluginOptions, pages: PageDictionary, itemFactory: NavigationItemFactory) {
		this._options = options;
		this._pages = pages;
		this._itemFactory = itemFactory;
		this._hasAddedStandardNavigationTitle = false;
	}

	/**
	 * Ensures that there are navigation items for plugin pages in the sidebar
	 *
	 * @param event TypeDoc Page evnet
	 */
	public addPluginNavigation(event: PageEvent): void {
		// Determine if the page being rendered is a plugin item
		const isPluginItem = (event.model as PluginPageUrlMappingModel).pagesPlugin.isPluginItem;

		this._ensureStandardNavigationHasTitle(event);
		this._ensureStandardNavigationVisible(event, isPluginItem);
		this._removeGlobalsNavigationItem(event);

		const pluginNavigationItems = this._getPluginNavigationItems(event, isPluginItem);

		// Clear out all previously added plugin items
		const nonPluginItems = event.navigation.children.filter((item: PluginNavigationItem) => {
			return !item.isPluginItem || item.isReflectionNavigationTitle;
		});

		// Add provided items to beginning of navigation
		event.navigation.children = [
			...pluginNavigationItems,
			...nonPluginItems,
		];
	}

	//#region NavigationItem Construction Helpers

	private _getPluginNavigationItems(event: PageEvent, isPluginItem: boolean): PluginNavigationItem[] {
		let groupsToRender: PageGroup[] = [];
		if (isPluginItem) {
			// If the page being rendered is a plugin page, we need to collect all of the page groups that should be rendered in this particular page's navigation sidebar
			groupsToRender = this._getGroupsForNavigation(event.model, this._pages.all);
		} else {
			// If the page being rendered is not a plugin page, we should render all page groups in this particular page's navigation sidebar
			groupsToRender = this._pages.all;
		}

		return this._buildNavigationForPageGroups(event, groupsToRender);
	}

	private _getGroupsForNavigation(currentPageModel: PluginPageUrlMappingModel, allGroups: PageGroup[]): PageGroup[] {
		let nearestGroup: PageGroup;
		const item = currentPageModel.pagesPlugin.item;
	
		switch (currentPageModel.pagesPlugin.type) {
			case ModelItemType.Group:
				nearestGroup = item as PageGroup;
				break;
			case ModelItemType.Page:
				nearestGroup = (item as Page).parent;
				break;
			case ModelItemType.ChildPage:
				nearestGroup = (item as ChildPage).parent.parent;
				break;
			case ModelItemType.Section:
				return (item as PageSection).groups;
		}

		if (nearestGroup.parent) {
			return nearestGroup.parent.groups;
		} else {
			return allGroups;
		}
	}

	private _buildNavigationForPageGroups(event: PageEvent, groups: PageGroup[]): PluginNavigationItem[] {
		let items: PluginNavigationItem[] = [];

		this._buildBackButton(items, event);
	
		for (const group of groups) {
			items = [
				...items,
				...this._itemFactory.buildPageGroupItems(group, event.model, event.url),
			];
		}
	
		return items;
	}

	//#endregion

	//#region Reflection Navigation Helpers

	private _ensureStandardNavigationHasTitle(event: PageEvent): void {
		if (!this._hasAddedStandardNavigationTitle && this._options.reflectionNavigationTitle) {
			event.navigation.children.unshift(this._itemFactory.buildLabelItem(this._options.reflectionNavigationTitle, true));
			this._hasAddedStandardNavigationTitle = true;
		}
	}

	private _ensureStandardNavigationVisible(event: PageEvent, isPluginItem: boolean): void {
		if (isPluginItem) {
			for (const item of event.navigation.children) {
				item.isVisible = true;
			}
		}
	}

	private _removeGlobalsNavigationItem(event: PageEvent): void {
		if (this._options.replaceGlobalsPage) {
			for (let i = 0; i < event.navigation.children.length; i++) {
				if (event.navigation.children[i].isGlobals) {
					event.navigation.children.splice(i, 1);
				}
			}
		}
	}

	//#endregion

	//#region Back Button Helpers

	private _buildBackButton(items: PluginNavigationItem[], event: PageEvent): void {
		// No need for a back button if this is not a plugin page
		if (!event.model.pagesPlugin.item) {
			return;
		}
		
		const target = this._getBackButtonTarget((event.model.pagesPlugin as PluginPageUrlMappingModel).item);

		if (!target) {
			return;
		}

		let title: string;
		let url: string;

		if (target instanceof Page) { // Back button should redirect to parent page if the section is a child of a page
			title = target.title;
			url = target.url;
		} else {
			const group = target as PageGroup;
			title = group.title;
			url = group.pages[0].url;
		}

		items.push(this._itemFactory.buildBackButton(`🡠 Back to ${title}`, url));
	}

	private _getBackButtonTarget(item: BaseItem): BaseItem {
		if (undefined) {
			return undefined;
		} else if (item instanceof Page) {
			return this._getBackButtonTarget(item.parent);
		} else if (item instanceof ChildPage) {
			return this._getBackButtonTarget(item.parent.parent);
		} else if (item instanceof PageGroup) {
			return this._getBackButtonTarget(item.parent);
		} else if (item instanceof PageSection) {
			return item.parent;
		}
	}

	//#endregion
}
