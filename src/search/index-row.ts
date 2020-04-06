/**
 * @packageDocumentation
 * @module Search
 */

// TODO: document this
export interface IndexRow {
	id: number;
	kind: number;
	name: string;
	url: string;
	classes: string;
	parent?: string;
	pagesPluginContent?: string;
	pagesPluginParent?: string;
}
