import { JSDOM } from "jsdom";
import { GroupNavigationItem } from "./group-navigation-item";
import { PageNavigationItem } from "./page-navigation-item";

const Selectors = {
	NAVIGATION_SIDEBAR: ".tsd-navigation.primary",
};

const Classes = {
	CHILD_PAGE_NAV_ITEM: "pp-child",
	GROUP_NAV_ITEM: "pp-group",
	PAGE_NAV_ITEM: "pp-page",
	REFLECTION_NAV_ITEM: "tsd-kind-module",
	LEGACY_REFLECTION_NAV_ITEM: "tsd-kind-external-module",
	TYPEDOC_CURRENT_NAV_ITEM: "current",
};

function isGroupItem(element: HTMLElement): boolean {
	return element.classList.contains(Classes.GROUP_NAV_ITEM);
}

function isPageItem(element: HTMLElement): boolean {
	return element.classList.contains(Classes.PAGE_NAV_ITEM);
}

function isChildPageItem(element: HTMLElement): boolean {
	return element.classList.contains(Classes.CHILD_PAGE_NAV_ITEM);
}

function isReflectionItem(element: HTMLElement): boolean {
	return element.classList.contains(Classes.REFLECTION_NAV_ITEM) || element.classList.contains(Classes.LEGACY_REFLECTION_NAV_ITEM);
}

export class NavigationHelper {
	private _groups: GroupNavigationItem[];

	constructor(dom: JSDOM) {
		this._groups = [];

		const navigation = dom.window.document.querySelector(Selectors.NAVIGATION_SIDEBAR);
		const ul = navigation.querySelector("ul");
		const lis = ul.querySelectorAll("li");

		let lastGroup: GroupNavigationItem|undefined;
		let lastParentPage: PageNavigationItem|undefined;

		for (const li of lis) {
			const isGroup = isGroupItem(li);
			if (isGroup) {
				lastGroup = new GroupNavigationItem(li);
				this._groups.push(lastGroup);
				lastParentPage = undefined;
				continue;
			}
			
			const isPage = isPageItem(li);
			if (isPage) {
				const isChildPage = isChildPageItem(li);
				const parent = isChildPage ? lastParentPage : lastGroup;
				const page = new PageNavigationItem(li, parent);
				if (!isChildPage) {
					lastParentPage = page;
				}
				parent.children.push(page);
				continue;
			}

			const isReflection = isReflectionItem(li);
			if (isReflection) {
				const reflection = new PageNavigationItem(li, lastGroup);
				lastGroup.isReflectionTitle = true;
				lastGroup.children.push(reflection);
				lastParentPage = undefined;
				continue;
			}
		}
	}

	public get groups(): GroupNavigationItem[] {
		return this._groups;
	}
}