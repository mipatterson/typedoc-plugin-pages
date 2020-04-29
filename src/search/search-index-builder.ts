/**
 * @packageDocumentation
 * @module Search
 */

import { RendererEvent } from "typedoc/dist/lib/output/events";
import { PluginOptions } from "../options/models";
import { SearchManager } from "./search-manager";
import { Builder, trimmer } from "lunr";
import { join } from "path";
import { DeclarationReflection, ProjectReflection } from 'typedoc/dist/lib/models/reflections/index';
import { GroupPlugin } from 'typedoc/dist/lib/converter/plugins/GroupPlugin';
import { IndexDataRow } from "./models/index-row";
import { IndexData } from "./models/search-index";
import { IndexDataManager } from "./index-data-manager";
import { writeFileSync } from "fs";

export class SearchIndexBuilder implements SearchManager {
	private _options: PluginOptions;
	private _indexDataManager: IndexDataManager;

	/**
	 * Creates an instance of SearchManager
	 * @param options Plugin options
	 * @param indexDataManager Index data manager
	 */
	constructor(options: PluginOptions, indexDataManager: IndexDataManager) {
		this._options = options;
		this._indexDataManager = indexDataManager;
	}

	public populateSearchIndex(event: RendererEvent): void {
		try {
			// Do not populate search index if it has been disabled via options
			if (!this._options.enableSearch) {
				return;
			}

			const indexData = this._getTypeDocIndex(event);
			this._indexDataManager.updateTypeDocIndexData(indexData);

			const lunrIndex = this._buildIndex(indexData);

			this._writeIndexFile(event, indexData, lunrIndex);
		} catch (e) {
			throw new Error(`Failed to populate search index. ${e.message}`);
		}
	}

	private _getTypeDocIndex(event: RendererEvent): IndexData {
		try {
			const rows: IndexDataRow[] = [];
			const kinds = {};

			for (const key in event.project.reflections) {
				const reflection: DeclarationReflection = event.project.reflections[key] as DeclarationReflection;
				if (!(reflection instanceof DeclarationReflection)) {
					continue;
				}

				if (!reflection.url ||
					!reflection.name ||
					reflection.flags.isExternal ||
					reflection.name === "") {
					continue;
				}

				let parent = reflection.parent;
				if (parent instanceof ProjectReflection) {
					parent = undefined;
				}

				const row: IndexDataRow = {
					id: rows.length,
					kind: reflection.kind,
					name: reflection.name,
					url: reflection.url,
					classes: reflection.cssClasses
				};

				if (parent) {
					row.parent = parent.getFullName();
				}

				if (!kinds[reflection.kind]) {
					kinds[reflection.kind] = GroupPlugin.getKindSingular(reflection.kind);
				}

				rows.push(row);
			}

			return {
				kinds,
				rows,
			};
		} catch (e) {
			throw new Error(`Failed to get TypeDoc index. ${e.message}`);
		}
	}

	private _buildIndex(index: IndexData): any {
		try {
			const builder = new Builder();
			builder.pipeline.add(trimmer);

			builder.ref("id");
			builder.field("pagesPluginContent", {boost: 15});
			builder.field("name", {boost: 10});
			builder.field("parent");

			index.rows.forEach(row => builder.add(row));

			return builder.build();
		} catch (e) {
			throw new Error(`Failed to build index. ${e.message}`);
		}
	}

	private _writeIndexFile(event: RendererEvent, indexData: IndexData, lunrIndex: any): void {
		try {
			const fileLocation = join(event.outputDirectory, "assets", "js", "search.json");
			const data = JSON.stringify({
				kinds: indexData.kinds,
				rows: indexData.rows,
				index: lunrIndex
			});
			writeFileSync(fileLocation, data, "utf-8");
		} catch (e) {
			throw new Error(`Failed to write index file. ${e.message}`);
		}
	}
}