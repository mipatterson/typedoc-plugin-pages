/**
 * @packageDocumentation
 * @module Search
 */

import { join } from "path";
import { RendererEvent } from "typedoc/dist/lib/output/events";
import { PluginOptions } from "../../options/models";
import { IndexDataManager } from "../index-data-manager";
import { SearchManager } from "../search-manager";
import { SearchIndexParser } from "./search-index-parser";

// TODO: Document this
export class LegacySearchManager implements SearchManager {
	private _parser: SearchIndexParser;
	private _options: PluginOptions;
	private _indexDataManager: IndexDataManager;

	/**
	 * Creates an instance of SearchManager
	 * @param options Plugin options
	 * @param parser Search index parser
	 * @param indexDataManager Index data manager
	 */
	constructor(options: PluginOptions, parser: SearchIndexParser, indexDataManager: IndexDataManager) {
		this._options = options;
		this._parser = parser;
		this._indexDataManager = indexDataManager;
	}

	public populateSearchIndex(event: RendererEvent): void {
		try {
			// Do not populate search index if it has been disabled via options
			if (!this._options.enableSearch) {
				return;
			}

			const indexLocation = this._getSearchIndexLocation(event);
			const index = this._parser.parseSearchIndex(indexLocation);
			this._indexDataManager.updateTypeDocIndexData(index);
			this._parser.writeSearchIndex(index, indexLocation);
		} catch (e) {
			throw new Error(`Failed to populate search index. ${e.message}`);
		}
	}

	private _getSearchIndexLocation(event: RendererEvent): string {
		return join(event.outputDirectory, "assets", "js", "search.js");
	}
}