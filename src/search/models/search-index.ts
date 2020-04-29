/**
 * @packageDocumentation
 * @module Search
 */

import { IndexDataRow } from "./index-row";

// TODO: document this
export interface IndexData {
	kinds: {
		[id: string]: string;
	};
	rows: IndexDataRow[];
}
