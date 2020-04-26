/**
 * @packageDocumentation
 * @module Search
 */

import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import { SearchIndex } from "./search-index";

// TODO: Document this
export class SearchIndexParser {
	public parseSearchIndex(searchFileLocation: string): SearchIndex {
		try {
			const fileExtension = searchFileLocation.split('.').pop() as ('js' | 'json');

			if (fileExtension === 'json') {
				const searchJsonContents = this._readSearchJsonFile(searchFileLocation);

				return searchJsonContents;
			}

			const searchJsContents = this._readSearchJsFile(searchFileLocation);

			return this._parseIndexFromJs(searchJsContents);
		} catch (e) {
			throw new Error(`Failed to parse search index. ${e.message}`);
		}
	}

	public writeSearchIndex(index: SearchIndex, searchPathLocation: string): void {
		try {
			this._writeSearchJsFile(index, searchPathLocation);
			this._writeSearchJsonFile(index, searchPathLocation);
		} catch (e) {
			throw new Error(`Failed to write search index to disk. ${e.message}`);
		}
	}

	private _writeSearchJsFile(index: SearchIndex, searchFileLocation: string): void {
		try {
			const contents = `var typedoc = typedoc || {}; typedoc.search = typedoc.search || {}; typedoc.search.data = ${JSON.stringify(index)};`;
			const fileLocation = join(searchFileLocation, 'search.js');

			writeFileSync(fileLocation, contents, "utf8");
		} catch (e) {
			throw new Error(`Failed to write search.js file. ${e.message}`);
		}
	}

	private _writeSearchJsonFile(index: SearchIndex, searchFileLocation: string): void {
		try {
			const contents = JSON.stringify(index);
			const fileLocation = join(searchFileLocation, 'search.json');

			writeFileSync(fileLocation, contents, "utf8");
		} catch (e) {
			throw new Error(`Failed to write search.json file. ${e.message}`);
		}
	}

	private _readSearchJsFile(path: string): string {
		try {
			return readFileSync(path, "utf8");
		} catch (e) {
			throw new Error(`Failed to read search.js file. ${e.message}`);
		}
	}

	private _readSearchJsonFile(path: string): SearchIndex {
		try {
			return JSON.parse(readFileSync(path, "utf8"));
		} catch (e) {
			throw new Error(`Failed to read search.json file. ${e.message}`);
		}
	}

	private _parseIndexFromJs(js: string): SearchIndex {
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
