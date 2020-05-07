/**
 * @packageDocumentation
 * @module Search
 */

import * as compareVersions from "compare-versions";
import { PluginOptions } from "../options/models";
import { PageDictionary } from "../pages/models";
import { IndexDataManager } from "./index-data-manager";
import { LegacySearchManager } from "./legacy/legacy-search-manager";
import { SearchIndexParser } from "./legacy/search-index-parser";
import { SearchIndexBuilder } from "./search-index-builder";
import { SearchManager } from "./search-manager";

export class SearchManagerFactory {
	private readonly _typedocVersion: string;

	constructor(typedocVersion: string) {
		this._typedocVersion = typedocVersion;
	}

	public create(options: PluginOptions, pages: PageDictionary): SearchManager {
		if (compareVersions(this._typedocVersion, "0.17.4") >= 0) {
			return new SearchIndexBuilder(options, new IndexDataManager(pages));
		} else {
			return new LegacySearchManager(options, new SearchIndexParser(), new IndexDataManager(pages));
		}
	}
}