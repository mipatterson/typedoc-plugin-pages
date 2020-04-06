/**
 * @packageDocumentation
 * @module Options
 */

import { ChildPageDefinition } from "./child-page-definition";
import { PageSectionDefinition } from "./page-section-definition";

// TODO: Document this
export interface PageDefinition extends ChildPageDefinition {
	children?: Array<ChildPageDefinition|PageSectionDefinition>;
}
