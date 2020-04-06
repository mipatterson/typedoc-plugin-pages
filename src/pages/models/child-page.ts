/**
 * @packageDocumentation
 * @module Models
 */

import { ChildPageDefinition } from "../../options/models/";
import { Page } from "./page";
import { PageBase } from "./page-base";

// TODO: Document this
export class ChildPage extends PageBase {
	private _parent: Page;

	constructor(definition: ChildPageDefinition, urlPrefix: string, parent: Page) {
		super(definition, urlPrefix);
		this._parent = parent;
		parent.children.push(this);
	}

	public get parent(): Page {
		return this._parent;
	}
}