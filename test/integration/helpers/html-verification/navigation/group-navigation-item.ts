import { NavigationItem } from "./navigation-item";
import { NavigationItemType } from "./navigation-item-type";
import { AnchorNavigationItem } from "./anchor-navigation-item";
import { PageNavigationItem } from "./page-navigation-item";
import { ReflectionNavigationItem } from "./reflection-navigation-item";

export class GroupNavigationItem extends NavigationItem {
	public isReflectionTitle: boolean;
	private readonly _children: AnchorNavigationItem[];

	constructor(element: HTMLElement, parent?: NavigationItem) {
		super(element, NavigationItemType.Group, parent);
		this.isReflectionTitle = false;
		this._children = [];
	}

	public get children(): AnchorNavigationItem[] {
		return this._children;
	}

	public get pages(): PageNavigationItem[] {
		return this._children as any as PageNavigationItem[];
	}

	public get parent(): GroupNavigationItem|PageNavigationItem {
		return this._parent as GroupNavigationItem|PageNavigationItem;
	}

	public get reflections(): ReflectionNavigationItem[] {
		return this._children as any as ReflectionNavigationItem[];
	}

	public get title(): string {
		const span = this._element.getElementsByTagName("span")[0];
		return span.innerHTML.replace(/<wbr>/g, "");
	}
}