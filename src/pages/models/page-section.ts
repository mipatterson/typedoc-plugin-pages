/**
 * @packageDocumentation
 * @module Models
 */

import { PageSectionDefinition } from "../../options/models/";
import { BaseItem } from "./base-item";
import { Page } from "./page";
import { PageGroup } from "./page-group";

// TODO: Document this
export class PageSection extends BaseItem{
	private _parent: Page|PageGroup;
	private _groups: PageGroup[];

	constructor(definition: PageSectionDefinition, urlPrefix: string, parent: Page|PageGroup) {
		super(definition, urlPrefix);
		this._groups = [];
		this._parent = parent;
		if (parent instanceof Page) {
			parent.children.push(this);
		} else {
			parent.pages.push(this);
		}
	}

	public get groups(): PageGroup[] {
		return this._groups;
	}

	public get parent(): Page|PageGroup {
		return this._parent;
	}
}
