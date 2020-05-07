import { AnchorNavigationItem } from "./anchor-navigation-item";
import { NavigationItemType } from "./navigation-item-type";
import { GroupNavigationItem } from "./group-navigation-item";

export class PageNavigationItem extends AnchorNavigationItem {
	private readonly _children: PageNavigationItem[];

	constructor(element: HTMLElement, parent?: GroupNavigationItem|PageNavigationItem) {
		super(element, NavigationItemType.Page, parent);
		this._children = [];
	}

	public get children(): PageNavigationItem[] {
		return this._children;
	}

	public get isActiveParent(): boolean {
		return this._children.filter(c => c.isCurrentPage).length > 0;
	}

	public get isChildPage(): boolean {
		return this.parent && this.parent.type === NavigationItemType.Page;
	}

	public get parent(): GroupNavigationItem|PageNavigationItem {
		return this._parent as GroupNavigationItem|PageNavigationItem;
	}

	public get title(): string {
		return this.anchor.innerHTML.replace(/<wbr>/g, "");
	}
}