/**
 * @packageDocumentation
 * @module Models
 */

import { PageGroupDefinition } from "../../options/models/";
import { BaseItem } from "./base-item";
import { Page } from "./page";
import { PageSection } from "./page-section";

// TODO: Document this
export class PageGroup extends BaseItem {
	private _pages: Array<Page|PageSection>;
	private _parent: PageSection|undefined

	constructor(definition: PageGroupDefinition, urlPrefix: string, parent?: PageSection) {
		super(definition, urlPrefix);
		this._pages = [];
		if (parent) {
			this._parent = parent;
			parent.groups.push(this);
		}
	}

	public get pages(): Array<Page|PageSection> {
		return this._pages;
	}

	public get parent(): PageSection|undefined {
		return this._parent;
	}
}
