/**
 * @packageDocumentation
 * @module Search
 */
import { existsSync } from "fs";
import { join } from "path";
import { RendererEvent } from "typedoc/dist/lib/output/events";
import { PluginOptions } from "../options/models/";
import { Page, PageBase, PageDictionary, PageGroup } from "../pages/models/";
import { IndexRow } from "./index-row";
import { SearchIndex } from "./search-index";
import { SearchIndexParser } from "./search-index-parser";

// TODO: Document this
export class SearchManager {
	private _parser: SearchIndexParser;
	private _options: PluginOptions;
	private _pages: PageDictionary;

	/**
	 * Creates an instance of SearchManager
	 * @param options Plugin options
	 * @param pages Page dictionary
	 * @param parser Search index parser
	 */
	constructor(options: PluginOptions, pages: PageDictionary, parser: SearchIndexParser) {
		this._options = options;
		this._pages = pages;
		this._parser = parser;
	}

	public populateSearchIndex(event: RendererEvent): void {
		try {
			// Do not populate search index if it has been disabled via options
			if (!this._options.enableSearch) {
				return;
			}

			const indexPathname = this._getSearchIndexPath(event);
			const indexLocation = this._getSearchIndexLocation(event);
			const index = this._parser.parseSearchIndex(indexLocation);
			
			this._updateExistingIndexRows(index);
			this._addPagesToIndex(index);
			this._parser.writeSearchIndex(index, indexPathname);
		} catch (e) {
			throw new Error(`Failed to populate search index. ${e.message}`);
		}
	}

	private _getSearchIndexPath(event: RendererEvent): string {
		const assetsPath = join(event.outputDirectory, "assets", "js");

		return assetsPath;
	}

	private _getSearchIndexLocation(event: RendererEvent): string {
		const assetsPath = this._getSearchIndexPath(event);
		const JSFile = join(assetsPath, 'search.js');
		const JSONFile = join(assetsPath, 'search.json');

		if (existsSync(JSONFile)) {
			return JSONFile;
		}
		
		return JSFile;
	}

	private _updateExistingIndexRows(index: SearchIndex): void {
		for (const row of index.rows) {
			// Add search result parent title property
			if (row.parent) {
				row.pagesPluginParent = row.parent + ".";
			}
		}
	}

	private _addPagesToIndex(index: SearchIndex): void {
		try {
			index.kinds["9999999"] = "Page";
			for (const group of this._pages.all) {
				this._addGroupToIndex(index, group);
			}
		} catch (e) {
			throw new Error(`Failed to add pages to index. ${e.message}`);
		}
	}

	private _addGroupToIndex(index: SearchIndex, group: PageGroup): void {
		for (const groupItem of group.pages) {
			if (groupItem instanceof PageBase) { // TODO: Figure out what to do with sections and groups
				this._addPageToIndex(index, groupItem);
			}
		}
	}

	private _addPageToIndex(index: SearchIndex, page: PageBase): void {
		const highestRowId = index.rows[index.rows.length - 1].id;
		const row: IndexRow = {
			id: highestRowId + 1,
			kind: 1,
			name: page.title,
			url: page.url,
			classes: "tsd-kind-page",
			pagesPluginContent: page.contents,
			parent: page.parent.title,
			pagesPluginParent: page.parent.title + " / ", // TODO: include more parents and make the number configurable
		};
		index.rows.push(row);
	
		if (page instanceof Page) {
			for (const childItem of page.children) {
				if (childItem instanceof PageBase) { // TODO: Figure out what to do with sections and groups
					this._addPageToIndex(index, childItem);
				}
			}
		}
	}
}