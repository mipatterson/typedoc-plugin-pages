/**
 * @packageDocumentation
 * @module Links
 */

import { MarkdownEvent, PageEvent } from "typedoc/dist/lib/output/events";
import { Logger } from "typedoc/dist/lib/utils";
import { PluginOptions } from "../options/models/";
import { PageDictionary, PageGroup } from "../pages/models/";
import { getRelativeUrl } from "../utilities/path-utilities";
import { InvalidPageLink } from "./invalid-page-link";

export const INVALID_LINKS_HEADER_STRING = `[PagesPlugin]: Found invalid page link tag(s). They will not render as links in the generated documentation:`;

/**
 * Regex object used to find `@page` and `@pagelink` tags in the parsed Markdown
 */
const PAGE_LINK_REGEX = /(?:\[(.+?)\])?\{@(page|pagelink)\s+((?:.|\n)+?)\}/gi;

/**
 * Parses Markdown text and replaces page link tags with hyperlinks to pages and page groups
 */
export class PageLinkParser {
	private _logger: Logger;
	private _options: PluginOptions;
	private _pages: PageDictionary;
	private _currentPageTitle: string;
	private _currentPageUrl: string;
	private _invalidePageLinks: InvalidPageLink[];

	/**
	 * Creates an instance of PageLinkParser
	 * @param options Plugin options
	 * @param pages Page dictionary
	 * @param logger TypeDoc logger
	 */
	constructor(options: PluginOptions, pages: PageDictionary, logger: Logger) {
		this._options = options;
		this._pages = pages;
		this._logger = logger;
		this._invalidePageLinks = [];
	}

	/**
	 * Configures the parser with the page currently being rendered
	 * @param event TypeDoc page event
	 */
	public setCurrentPage(event: PageEvent): void {
		this._currentPageTitle = event.model.name;
		this._currentPageUrl = event.url;
	}

	/**
	 * Parses the Markdown text provided in the TypeDoc Markdown event, replacing page link tags with hyperlinks
	 * 
	 * If the {@link PluginOptions.enablePageLinks} option is false, this method will not replace the page links.
	 * @param event TypeDoc Markdown event
	 */
	public parsePageLinks(event: MarkdownEvent): void {
		// Do nothing if page links are disabled
		if (!this._options.enablePageLinks) {
			return;
		}

		// Replace any page link tags with hyperlinks
		event.parsedText = event.parsedText.replace(PAGE_LINK_REGEX, this._handlePageLink);
	}

	/**
	 * Writes the list of invalid page links to the console
	 * 
	 * If the {@link PluginOptions.listInvalidPageLinks} option is false, this method will not list any invalid page links.
	 */
	public listInvalidPageLinks(): void {
		// Do nothing if invalid page links should not be listed or if there are no invalid page links
		if (!this._options.listInvalidPageLinks || this._invalidePageLinks.length === 0) {
			return;
		}

		let warningString = INVALID_LINKS_HEADER_STRING;

		for (const link of this._invalidePageLinks) {
			warningString += `\n  In ${link.page}: ${link.tag}`;
		}

		this._logger.warn(warningString);
	}

	/**
	 * Handles the replacement of a page link tags
	 * 
	 * If the tag points at a page group, the page groups first page will be used as the link target. If the tab points at a page section, the first page of the 
	 * first group in the section will be used as the link target. If no page or page group is found for the provided title, then the tag will not be replaced.
	 * @param match The entire matching page link tag
	 * @param leading The text leading before the tag
	 * @param tagName The type of tag that was used (i.e. `@page` or `@pagelink`)
	 * @param linkText The text following the tag - this is used to find the page or page group by title
	 * @returns The string to replace the tag with
	 */
	private _handlePageLink = (match: string, leading: string, tagName: string, linkText: string): string => { // TODO: Figure out how to handle multiple hits or page sections
		try {
			// Attempt to find page or group with provided title
			const item = this._pages.getByTitle(linkText);

			if (!item) {
				throw new Error(`Failed to find page or group with title "${linkText}"`);
			}

			let url = item.url;

			// If the link is for a group, direct the link at the first page in the group
			if (item instanceof PageGroup) {
				url = item.pages.length.toString();
				if (item.pages.length === 0) {
					throw new Error(`Cannot create page link for group "${item.title}" because it has no pages.`);
				}

				url = item.pages[0].url;
			}

			// Convert the absolute URL to one relative to the current page being rendered
			const relativeUrl = this._getRelativeUrl(url, this._currentPageUrl);

			// Replace the page link tag with a HTML hyperlink
			return `<a href="${relativeUrl}">${linkText}</a>`;
		} catch (e) {
			if (this._options.failBuildOnInvalidPageLink) {
				throw new Error(`Found invalid page link tag "${match}" on page "${this._currentPageTitle}": ${e.message}`);
			}

			// Register the invalid page link
			this._invalidePageLinks.push({
				page: this._currentPageTitle,
				tag: match,
			});
			
			// Leave the original text
			return match;
		}
	}

	/**
	 * Converts the provided absolute URL to a URL relative to the current page's URL
	 * @param absoluteUrl Absolute URL to convert to a relative URL
	 * @param relativeTo URL to make the URL relative to
	 * @returns The converted URL
	 */
	private _getRelativeUrl(absoluteUrl: string, relativeTo: string): string {
		return getRelativeUrl(absoluteUrl, relativeTo);
	}
}
