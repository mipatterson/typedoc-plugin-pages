import { AnchorNavigationItem } from "./anchor-navigation-item";
import { NavigationItemType } from "./navigation-item-type";
import { GroupNavigationItem } from "./group-navigation-item";

export class ReflectionNavigationItem extends AnchorNavigationItem {
	constructor(element: HTMLElement, parent?: GroupNavigationItem) {
		super(element, NavigationItemType.Reflection, parent);
	}

	public get parent(): GroupNavigationItem {
		return this._parent as GroupNavigationItem;
	}

	public get title(): string {
		return this.anchor.innerText;
	}
}