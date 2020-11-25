import { ElementHandle, Page } from "puppeteer";

/**
 * Model representing a search result in the UI
 */
export interface SearchResult {
	href: string;
	kind: string;
	name: string;
	parent: string;
}

/**
 * Puppeteer page object for interacting with the search functionality in the UI
 */
export class SearchPageObject {
	private readonly _page: Page;

	/**
	 * Creates a new instance of SearchPageObject
	 * @param page Puppeteer page object
	 */
	constructor(page: Page) {
		this._page = page;
	}

	/**
	 * Executes a search via the UI
	 * @param query Term to seach for
	 * @returns Promise that resolves to a list of search results
	 */
	public async search(query: string): Promise<SearchResult[]> {
		try {
			const results: SearchResult[] = [];

			// Clear the search input
			const searchField = await this._page.$("input#tsd-search-field");
			await searchField.evaluate((e: HTMLInputElement) => e.value = "");

			// Find the search icon
			const searchIcon = await this._page.$("label.tsd-widget.search");

			// Open the search input
			await searchIcon.click();

			// Execute query
			await this._page.keyboard.type(query);

			await new Promise<void>(res => setTimeout(res, 10000));

			// Parse results
			const resultEls = await this._page.$$("ul.results li");

			for (const el of resultEls) {
				results.push(await this._parseResult(el));
			}

			return results;
		} catch (e) {
			throw new Error(`Failed to execute search with query "${query}" ${e.message}`);
		}
	}

	private async _parseResult(element: ElementHandle): Promise<SearchResult> {
		try {
			// Parse href
			const anchorEl = await element.$("a.tsd-kind-icon");
			const hrefProperty = await anchorEl.getProperty("href");
			const href = await hrefProperty.jsonValue() as string;

			// Parse result kind
			const classNameProperty = await element.getProperty("className");
			const classes = await classNameProperty.jsonValue() as string;
			const kind = classes.split(" ")[0].substr(9);

			// Parse name
			const anchorTextProperty = await anchorEl.getProperty("textContent");
			let name = await anchorTextProperty.jsonValue() as string;

			// Parse parent
			let parent = "";
			const parentEl = await anchorEl.$("span.parent");
			if (parentEl) {
				const spanTextProperty = await parentEl.getProperty("textContent");
				parent = await spanTextProperty.jsonValue() as string;

				// Remove parent from name
				name = name.replace(parent, "");

				// Remove trailing period or slash (based on TypeDoc version being used)
				if (parent.charAt(parent.length - 1) === ".") { // TypeDoc v0.17.4 and higher
					parent = parent.slice(0, -1);
				} else if (parent.length > 3 && parent.slice(parent.length - 3) === " / ") { // TypeDoc v0.17.3 and lower
					parent = parent.slice(0, -3);
				}
			}

			return {
				href,
				kind,
				name,
				parent,
			};
		} catch (e) {
			throw new Error(`Failed to parse search result. ${e.message}`);
		}
	}
}