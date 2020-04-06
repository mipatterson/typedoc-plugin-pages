/**
 * @packageDocumentation
 * @module Rendering
 */

import { NavigationItem } from "typedoc";
import { ChildPage, Page, PageGroup, PageSection } from "../pages/models/";
import { PluginPageUrlMappingModel } from "./plugin-page-url-mapping-model";
import { PluginNavigationItem } from "./plugin-navigation-item";

/**
 * Factory class for creating TypeDoc navigation items
 */
// TODO: Document this
export class NavigationItemFactory {
	/**
	 * Creates a TypeDoc navigation item that serves as a navigation sidebar title
	 *
	 * @param label Label text
	 * @returns The created navigation item
	 */
	public buildLabelItem(label: string, isReflectionNavigationTitle: boolean): PluginNavigationItem {
		const item = new NavigationItem(label) as PluginNavigationItem;
		item.isPluginItem = true;
		item.isReflectionNavigationTitle = isReflectionNavigationTitle;
		item.isLabel = true;
		item.isVisible = true;
		item.cssClasses = "pp-nav pp-group";
		return item;
	}

	/**
	 * Creates tje TypeDoc navigation items for a page group
	 *
	 * @param navigationItemGroup Group to render the navigation item for
	 * @param pageRenderModel Model for the current page render
	 * @param urlBeingRendered The URL of the current page render
	 * @returns The created navigation items
	 */
	public buildPageGroupItems(navigationItemGroup: PageGroup, pageRenderModel: PluginPageUrlMappingModel, urlBeingRendered: string): PluginNavigationItem[] {
		let items: PluginNavigationItem[] = [];

		items.push(this.buildLabelItem(navigationItemGroup.title, false));

		for (const groupMember of navigationItemGroup.pages) {
			if (groupMember instanceof Page) {
				items = [
					...items,
					...this.buildPageItems(groupMember, pageRenderModel, urlBeingRendered),
				];
			} else if (groupMember instanceof PageSection) {
				items = [
					...items,
					...this.buildSectionItems(groupMember),
				];
			}
		}

		return items;
	}

	public buildSectionItems(section: PageSection): PluginNavigationItem[] {
		const url = section.groups[0].pages[0].url;
		return [this.buildItem(section.title, url, false, false, false, false)];
	}

	/**
	 * Creates the TypeDoc navigation items for a page
	 *
	 * @param navigationItemPage Page to render the navigation item for
	 * @param pageRenderModel Model for the current page render
	 * @param urlBeingRendered The URL of the current page render
	 * @returns The created navigation items
	 */
	public buildPageItems(navigationItemPage: Page, pageRenderModel: PluginPageUrlMappingModel, urlBeingRendered: string): PluginNavigationItem[] {
		let items: PluginNavigationItem[] = [];

		const thisIsParent = navigationItemPage.children.length > 0;
		const thisIsActivePage = pageRenderModel.pagesPlugin && pageRenderModel.pagesPlugin.item === navigationItemPage;
		const childIsActivePage = pageRenderModel.pagesPlugin && pageRenderModel.pagesPlugin.item && pageRenderModel.pagesPlugin.item.parent === navigationItemPage;

		items.push(this.buildItem(navigationItemPage.title, navigationItemPage.url, navigationItemPage.url === urlBeingRendered, false, thisIsParent, childIsActivePage));

		if (thisIsActivePage || childIsActivePage) {
			for (const child of navigationItemPage.children) {
				if (child instanceof ChildPage) {
					items = [
						...items,
						...this.buildChildPageItems(child, urlBeingRendered),
					];
				} else if (child instanceof PageSection) {
					items = [
						...items,
						...this.buildSectionItems(child),
					];
				}
			}
		}

		return items;
	}

	/**
	 * Creates the TypeDoc navigation items for a child page
	 *
	 * @param navigationItemPage Page to render the navigation item for
	 * @param urlBeingRendered The URL of the current page render
	 * @returns The created navigation items
	 */
	public buildChildPageItems(navigationItemPage: ChildPage, urlBeingRendered: string): PluginNavigationItem[] {
		const items: PluginNavigationItem[] = [];

		items.push(this.buildItem(navigationItemPage.title, navigationItemPage.url, navigationItemPage.url === urlBeingRendered, true, false, false));

		return items;
	}

	/**
	 * Creates a TypeDoc navigation item
	 *
	 * @param label Item text
	 * @param url Item URL
	 * @param isActive Whether the item is active
	 * @param isChild Whether the item is a child page
	 * @param isParent Whether the item is a parent
	 * @param isParentOfActive Whether the item is a parent of the active page
	 * @returns The created navigation item
	 */
	public buildItem(label: string, url: string, isActive: boolean, isChild: boolean, isParent: boolean, isParentOfActive: boolean): PluginNavigationItem {
		const item = new NavigationItem(label, url) as PluginNavigationItem;

		item.isPluginItem = true;
		item.isLabel = false;
		item.isVisible = true;
		item.isInPath = isActive;

		let cssClasses = "pp-nav pp-page";
		if (isChild) {
			cssClasses += " pp-child";
		} else if (isParent) {
			cssClasses += " pp-parent";

			if (isParentOfActive) {
				cssClasses += " pp-active";
			}
		}
		item.cssClasses = cssClasses;

		return item;
	}

	public buildBackButton(label: string, url: string): PluginNavigationItem {
		const item = new NavigationItem(label, url) as PluginNavigationItem;

		item.isPluginItem = true;
		item.isLabel = false;
		item.isVisible = true;
		item.isInPath = false;
		item.cssClasses = "pp-nav pp-back-btn";

		return item;
	}
}