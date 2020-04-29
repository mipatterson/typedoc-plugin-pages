/**
 * @packageDocumentation
 * @module Options
 */

import { ChildPageDefinition, PageDefinition, PageGroupDefinition, PluginOptions, PageSectionDefinition } from "./models/";
import { defaultOptionAndValidateIsArray, defaultOptionAndValidateIsBoolean, defaultOptionAndValidateIsString,
		validateOptionIsArray, validateOptionIsString } from "./validation-utilities";
import * as Constants from "../constants";
import { join } from "path";
import { ensurePathHasExtension, getFilename } from "../utilities/path-utilities";

/**
 * Helper class for validating plugin options
 */
export class OptionValidator {
	public validate(options: PluginOptions): void {
		defaultOptionAndValidateIsBoolean(options, "enablePageLinks", Constants.DEFAULT_ENABLE_PAGE_LINKS);
		defaultOptionAndValidateIsBoolean(options, "enableSearch", Constants.DEFAULT_ENABLE_SEARCH);
		defaultOptionAndValidateIsBoolean(options, "failBuildOnInvalidPageLink", Constants.DEFAULT_FAIL_BUILD_ON_INVALID_PAGE_LINK);
		defaultOptionAndValidateIsArray(options, "groups", []);
		defaultOptionAndValidateIsBoolean(options, "listInvalidPageLinks", Constants.DEFAULT_LIST_INVALID_PAGE_LINKS);
		defaultOptionAndValidateIsString(options, "output", Constants.DEFAULT_OUTPUT);
		defaultOptionAndValidateIsString(options, "reflectionNavigationTitle", Constants.DEFAULT_REFLECTION_NAV_TITLE);
		defaultOptionAndValidateIsBoolean(options, "replaceGlobalsPage", Constants.DEFAULT_REPLACE_GLOBALS_PAGE);
		defaultOptionAndValidateIsString(options, "source", ".");

		for (const group of options.groups) {
			this._validateGroup(group, options.source);
		}
	}

	private _validateGroup(definition: PageGroupDefinition, sourcePrefix: string): void {
		try {
			validateOptionIsString(definition, "title");
			defaultOptionAndValidateIsString(definition, "source", ".");
			defaultOptionAndValidateIsString(definition, "output", definition.title); // Use title as default output directory
			defaultOptionAndValidateIsArray(definition, "pages", []);

			definition.source = join(sourcePrefix, definition.source);
		
			// Validate any pages or sub-sections in the group
			for (const page of definition.pages) {
				this._validatePageOrSection(page, definition.source, false);
			}
		} catch (e) {
			throw new Error(`Invalid definition for page group "${definition.title}": ${e.message}`);
		}
	}

	private _validatePageOrSection(definition: PageDefinition|ChildPageDefinition|PageSectionDefinition, sourcePrefix: string, isChild: boolean): void {
		const isSection = !!(definition as any).groups;

		if (isSection) {
			this._validateSection(definition as PageSectionDefinition, sourcePrefix);
		} else {
			this._validatePage(definition as ChildPageDefinition, sourcePrefix, isChild);
		}
	}

	private _validateSection(definition: PageSectionDefinition, sourcePrefix: string): void {
		try {
			validateOptionIsString(definition, "title");
			validateOptionIsArray(definition, "groups");
			defaultOptionAndValidateIsString(definition, "source", ".");
			defaultOptionAndValidateIsString(definition, "output", definition.title); // Use title as default output directory

			definition.source = join(sourcePrefix, definition.source); // Apply the source prefix
		
			// Validate all groups in the section
			for (const group of definition.groups) {
				this._validateGroup(group, definition.source);
			}
		} catch (e) {
			throw new Error(`Invalid definition for section "${definition.title}": ${e.message}`);
		}
	}

	private _validatePage(definition: PageDefinition|ChildPageDefinition, sourcePrefix: string, isChild: boolean): void {
		try {
			validateOptionIsString(definition, "title");
			validateOptionIsString(definition, "source");
			defaultOptionAndValidateIsString(definition, "output", getFilename(definition.source, true)); // Use source file name as default output file name


			definition.output = ensurePathHasExtension(definition.output, ".html"); // Ensure the output file has an ".html" extension
			definition.source = join(sourcePrefix, definition.source); // Apply the source prefix
		
			if (!isChild) {
				const parentPage = definition as PageDefinition;
		
				defaultOptionAndValidateIsArray(parentPage, "children", []);
		
				// Validate any child pages or sub-sections of the page
				for (const child of parentPage.children) {
					this._validatePageOrSection(child, sourcePrefix, true);
				}
			}
		} catch (e) {
			throw new Error(`Invalid definition for page "${definition.title}": ${e.message}`);
		}
	}
}
