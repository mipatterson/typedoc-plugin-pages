/**
 * @packageDocumentation
 * @module Search
 */

import { readFileSync, writeFileSync } from "fs";
import { IndexData } from "../models/search-index";

// TODO: Document this
export class SearchIndexParser {
	public parseSearchIndex(searchJsLocation: string): IndexData {
		try {
			const searchJsContents = this._readSearchJsFile(searchJsLocation);
			return this._parseIndexFromJs(searchJsContents);
		} catch (e) {
			throw new Error(`Failed to parse search index. ${e.message}`);
		}
	}

	public writeSearchIndex(index: IndexData, searchJsLocation: string): void {
		try {
			const contents = `var typedoc = typedoc || {}; typedoc.search = typedoc.search || {}; typedoc.search.data = ${JSON.stringify(index)};`;
			writeFileSync(searchJsLocation, contents, "utf-8");
		} catch (e) {
			throw new Error(`Failed to write search index to disk. ${e.message}`);
		}
	}

	private _readSearchJsFile(path: string): string {
		try {
			return readFileSync(path, "utf8");
		} catch (e) {
			throw new Error(`Failed to read search.js file. ${e.message}`);
		}
	}

	private _parseIndexFromJs(js: string): IndexData {
		try {
			const searchString = "typedoc.search.data = ";
			const startIndex = js.indexOf(searchString);
			const indexString = js.substring(startIndex + searchString.length, js.length - 1);
			const index = JSON.parse(indexString);
			return index;
		} catch (e) {
			throw new Error(`Failed to parse search index from JavaScript. ${e.message}`);
		}
	}
}
