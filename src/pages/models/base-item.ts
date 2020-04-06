/**
 * @packageDocumentation
 * @module Models
 */

import { join } from "path";
import { ChildPageDefinition, PageDefinition, PageGroupDefinition, PageSectionDefinition } from "../../options/models/";

// TODO: Document this
export abstract class BaseItem {
	protected _title: string;
	protected _url: string;

	constructor(definition: PageDefinition|ChildPageDefinition|PageSectionDefinition|PageGroupDefinition, urlPrefix: string) {
		this._title = definition.title;
		this._url = join(urlPrefix, definition.output);
	}

	public abstract get parent(): BaseItem|undefined;

	public get title(): string {
		return this._title;
	}

	public get url(): string {
		return this._url;
	}
}
