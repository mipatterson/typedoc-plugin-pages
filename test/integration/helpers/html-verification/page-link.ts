import { JSDOM } from "jsdom";

/**
 * Object representing a page link in the rendered HTML
 */
export class PageLink {
	private readonly _title: string;
	private readonly _href: string;

	/**
	 * Creates a new instance of PageLink
	 * @param element HTMLElement of the link
	 */
	constructor(element: HTMLElement) {
		this._title = element.innerHTML;
		this._href = element.getAttribute("href");
	}

	/**
	 * Page title
	 */
	public get title(): string {
		return this._title;
	}

	/**
	 * Link URL
	 */
	public get href(): string {
		return this._href;
	}
}

/**
 * Retrieves all of the {@link PageLink}s in the provided HTML
 * @param dom JSDOM object for the page
 * @returns Array of page link objects
 */
export const getPageLinks = (dom: JSDOM): PageLink[] => {
	const links: PageLink[] = [];

	const linkList = dom.window.document.querySelector(".tsd-panel.tsd-typography ul");

	if (linkList) {
		const lis = linkList.querySelectorAll("li");

		for (const li of lis) {
			const anchorEl = li.querySelector("a");
			links.push(new PageLink(anchorEl));
		}
	}

	return links;
};