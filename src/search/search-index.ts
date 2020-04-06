/**
 * @packageDocumentation
 * @module Search
 */

import { IndexRow } from "./index-row";

// TODO: document this
export interface SearchIndex {
	kinds: {
		[id: string]: string;
	};
	rows: IndexRow[];
}
