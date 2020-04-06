/**
 * @packageDocumentation
 * @module Options
 */

import { PageDefinition } from "./page-definition";
import { PageSectionDefinition } from "./page-section-definition";

// TODO: Document this
export interface PageGroupDefinition {
	output?: string;
	pages: Array<PageDefinition|PageSectionDefinition>;
	source?: string;
	title: string;
}
