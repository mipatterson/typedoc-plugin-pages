/**
 * @packageDocumentation
 * @module Pages
 */

import { join } from "path";
import { ChildPageDefinition, PageDefinition, PageGroupDefinition, PageSectionDefinition, PluginOptions } from "../options/models/";
import { getFilename } from "../utilities/path-utilities";
import { ChildPage, Page, PageDictionary, PageGroup, PageSection } from "./models/";

// TODO: document this
export class PageDictionaryFactory {
	public buildDictionary(options: PluginOptions): PageDictionary {
		const groups: PageGroup[] = [];

		for (const group of options.groups) {
			groups.push(this._parsePageGroup(group, options.output));
		}

		return new PageDictionary(groups);
	}

	private _parsePageGroup(definition: PageGroupDefinition, urlPrefix: string, parent?: PageSection): PageGroup {
		const group = new PageGroup(definition, urlPrefix, parent);
	
		for (const item of definition.pages) {
			this._parsePageOrSection(item, group.url, group);
		}
	
		return group;
	}

	private _parsePageOrSection(definition: PageDefinition|PageSectionDefinition, urlPrefix: string, parent: Page|PageGroup): void {
		const isSection = !!(definition as any).groups;

		if (isSection) {
			this._parseSection(definition as PageSectionDefinition, urlPrefix, parent);
		} else {
			this._parsePage(definition as PageDefinition, parent as PageGroup);
		}
	}

	private _parseSection(definition: PageSectionDefinition, urlPrefix: string, parent: Page|PageGroup): void {
		const section = new PageSection(definition, urlPrefix, parent);

		for (const group of definition.groups) {
			this._parsePageGroup(group, section.url, section);
		}
	}

	private _parsePage(definition: PageDefinition, parent: PageGroup): void {
		const page = new Page(definition, parent);
	
		// Get directory name for any child pages or sub-sections
		const subDirectory = join(parent.url, getFilename(definition.output, true));
	
		for (const child of definition.children) {
			this._parseChildPageOrSection(child, subDirectory, page);
		}
	}

	private _parseChildPageOrSection(definition: ChildPageDefinition|PageSectionDefinition, urlPrefix: string, parent: Page): void {
		const isSection = !!(definition as any).groups;

		if (isSection) {
			this._parseSection(definition as PageSectionDefinition, urlPrefix, parent);
		} else {
			this._parseChildPage(definition as ChildPageDefinition, urlPrefix, parent);
		}
	}

	private _parseChildPage(definition: ChildPageDefinition, urlPrefix: string, parent: Page): void {
		new ChildPage(definition, urlPrefix, parent);
	}
}
