/**
 * @packageDocumentation
 * @module Links
 */

/**
 * Information about an invalid page link
 */
export interface InvalidPageLink {
	/**
	 * The title of the page the link was on
	 */
	page: string;

	/**
	 * The tag that was parsed
	 */
	tag: string;
}
