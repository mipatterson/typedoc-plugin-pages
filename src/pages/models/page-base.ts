/**
 * @packageDocumentation
 * @module Models
 */

import { readFileSync } from "fs";
import { ChildPageDefinition, PageDefinition } from "../../options/models/";
import { BaseItem } from "./base-item";
import { Page } from "./page";
import { PageGroup } from "./page-group";

// TODO: Document this
export abstract class PageBase extends BaseItem {
	private _contents: string|undefined;
	private _source: string;

	constructor(definition: PageDefinition|ChildPageDefinition, urlPrefix: string) {
		super(definition, urlPrefix);
		this._source = definition.source;
	}

	public get contents(): string {
		try {
			if (!this._contents) {
				this._contents = readFileSync(this.source, "utf8");
			}

			return this._contents;
		} catch (e) {
			throw new Error(`Failed to get page contents. ${e}`);
		}
	}

	public abstract get parent(): Page|PageGroup;

	public get source(): string {
		return this._source;
	}
}
