/**
 * @packageDocumentation
 * @module Options
 */

import { PageGroupDefinition } from "./page-group-definition";

// TODO: Document this
export interface PageSectionDefinition {
	groups: PageGroupDefinition[];
	output?: string;
	source?: string;
	title: string;
}
