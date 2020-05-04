import { NavigationItemType } from "./navigation-item-type";
import { NavigationItem } from "./navigation-item";

export abstract class AnchorNavigationItem extends NavigationItem {
	constructor(element: HTMLElement, type: NavigationItemType, parent?: NavigationItem) {
		super(element, type, parent);
	}

	public get isCurrentPage(): boolean {
		return this._element.classList.contains("current");
	}

	public get anchor(): HTMLElement {
		return this._element.getElementsByTagName("a")[0];
	}

	public get href(): string {
		return this.anchor.getAttribute("href");
	}
}