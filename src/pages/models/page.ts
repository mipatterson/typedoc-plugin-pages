/**
 * @packageDocumentation
 * @module Models
 */

import { PageDefinition } from "../../options/models/";
import { ChildPage } from "./child-page";
import { PageBase } from "./page-base";
import { PageGroup } from "./page-group";
import { PageSection } from "./page-section";

// TODO: Document this
export class Page extends PageBase {
	private _children: Array<ChildPage|PageSection>;
	private _parent: PageGroup;

	constructor(definition: PageDefinition, parent: PageGroup) {
		super(definition, parent.url);
		this._children = [];
		this._parent = parent;
		parent.pages.push(this);
	}

	public get children(): Array<ChildPage|PageSection> {
		return this._children;
	}

	public get parent(): PageGroup {
		return this._parent;
	}
}
