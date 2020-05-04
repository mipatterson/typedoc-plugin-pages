import { NavigationItemType } from "./navigation-item-type";

export abstract class NavigationItem {
	public abstract readonly parent: NavigationItem;
	public abstract readonly title: string;

	protected readonly _element: HTMLElement;
	protected readonly _parent: NavigationItem|undefined;
	protected readonly _type: NavigationItemType;

	constructor(element: HTMLElement, type: NavigationItemType, parent?: NavigationItem) {
		this._element = element;
		this._parent = parent;
		this._type = type;
	}

	public get type(): NavigationItemType {
		return this._type;
	}
}