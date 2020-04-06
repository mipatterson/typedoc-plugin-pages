/**
 * @packageDocumentation
 * @module Pages
 */

import { ChildPage } from "./child-page";
import { Page } from "./page";
import { PageGroup } from "./page-group";
import { PageSection } from "./page-section";

// TODO: document this
export class PageDictionary {
	private _groups: PageGroup[];

	constructor(groups: PageGroup[]) {
		this._groups = groups;
	}

	public get all(): PageGroup[] {
		return this._groups;
	}

	public getByTitle(title: string): Page|ChildPage|PageGroup|PageSection {
		for (const group of this.all) {
			const foundItem = this._recursivelyGetByTitle(group, title);
			if (foundItem) {
				return foundItem;
			}
		}
	}

	private _recursivelyGetByTitle(item: Page|ChildPage|PageGroup|PageSection, title: string): Page|ChildPage|PageGroup|PageSection {
		if (item.title === title) {
			return item;
		}
	
		if (item instanceof PageGroup) {
			for (const page of item.pages) {
				const foundItem = this._recursivelyGetByTitle(page, title);
				if (foundItem) {
					return foundItem;
				}
			}
		} else if (item instanceof PageSection) {
			for (const group of item.groups) {
				const foundItem = this._recursivelyGetByTitle(group, title);
				if (foundItem) {
					return foundItem;
				}
			}
		} else if (item instanceof Page) {
			for (const child of item.children) {
				const foundItem = this._recursivelyGetByTitle(child, title);
				if (foundItem) {
					return foundItem;
				}
			}
		}
	}
}
