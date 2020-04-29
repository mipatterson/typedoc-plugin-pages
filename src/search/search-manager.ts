/**
 * @packageDocumentation
 * @module Search
 */

import { RendererEvent } from "typedoc/dist/lib/output/events";

// TODO: Document this
export interface SearchManager {
	populateSearchIndex(event: RendererEvent): void;
}