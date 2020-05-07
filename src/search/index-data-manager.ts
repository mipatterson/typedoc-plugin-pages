/**
 * @packageDocumentation
 * @module Search
 */

import { IndexData } from "./models/search-index";
import { IndexDataRow } from "./models/index-row";
import { Page, PageBase, PageDictionary, PageGroup, PageSection } from "../pages/models";

// TODO: Document this
export class IndexDataManager {
	private _pages: PageDictionary;

	/**
	 * Creates an instance of IndexDataManager
	 * @param pages Page dictionary
	 */
	constructor(pages: PageDictionary) {
		this._pages = pages;
	}

	public updateTypeDocIndexData(indexData: IndexData): void {
		this._updateRowParents(indexData);
		this._addPages(indexData);
	}

	private _updateRowParents(indexData: IndexData): void {
		for (const row of indexData.rows) {
			// Add search result parent title property
			if (row.parent) {
				row.pagesPluginParent = row.parent + ".";
			}
		}
	}

	private _addPages(indexData: IndexData): void {
		indexData.kinds["9999999"] = "Page";
		for (const group of this._pages.all) {
			this._addGroupToIndex(indexData, group);
		}
	}

	private _addGroupToIndex(index: IndexData, group: PageGroup): void {
		for (const groupItem of group.pages) {
			if (groupItem instanceof PageBase) {
				this._addPageToIndex(index, groupItem);
			} else if (groupItem instanceof PageSection) {
				for (const group of groupItem.groups) {
					this._addGroupToIndex(index, group);
				}
			}
		}
	}

	private _addPageToIndex(index: IndexData, page: PageBase): void {
		const highestRowId = index.rows[index.rows.length - 1].id;
		const row: IndexDataRow = {
			id: highestRowId + 1,
			kind: 1,
			name: page.title,
			url: page.url,
			classes: "tsd-kind-page",
			pagesPluginContent: page.contents,
			parent: undefined,
			pagesPluginParent: page.parent.title + " / ",
		};
		index.rows.push(row);
	
		if (page instanceof Page) {
			for (const childItem of page.children) {
				if (childItem instanceof PageBase) {
					this._addPageToIndex(index, childItem);
				} else if (childItem instanceof PageSection) {
					for (const group of childItem.groups) {
						this._addGroupToIndex(index, group);
					}
				}
			}
		}
	}
}