import { parseHTMLOutputFile } from "../../helpers/html-verification/html-parsing-helpers";
import { GroupNavigationItem, NavigationHelper, PageNavigationItem, ReflectionNavigationItem } from "../../helpers/html-verification/navigation";

const verifyGroupProperties = (group: GroupNavigationItem, title: string, children: number, isReflectionTitle: boolean, hasParent: boolean): void => {
	expect(group.title).toEqual(title);
	expect(group.isReflectionTitle).toEqual(isReflectionTitle);
	expect(group.children.length).toEqual(children);
	expect(!!group.parent).toBe(hasParent);
};

const verifyPageProperties = (page: PageNavigationItem, title: string, href: string, isCurrentPage: boolean, children = 0, isActiveParent = false): void => {
	expect(page.title).toEqual(title);
	expect(page.href).toEqual(href);
	expect(page.isCurrentPage).toBe(isCurrentPage);
	expect(page.children.length).toEqual(children);
	expect(page.isActiveParent).toBe(isActiveParent);
};

const verifyReflectionProperties = (page: ReflectionNavigationItem, title: string, href: string, isCurrentPage: boolean): void => {
	expect(page.title).toEqual(title);
	expect(page.href).toEqual(href);
	expect(page.isCurrentPage).toBe(isCurrentPage);
};

const verifyReflectionsGroupProperties = (group: GroupNavigationItem, title: string, currentDepth: number): void => {
	verifyGroupProperties(group, title, 2, true, false);
	let hrefPrefix = "";
	for (let i = 0; i < currentDepth; i++) {
		hrefPrefix += "../";
	}
	verifyReflectionProperties(group.reflections[0], `"bar"`, `${hrefPrefix}modules/_bar_.html`, false);
	verifyReflectionProperties(group.reflections[1], `"foo"`, `${hrefPrefix}modules/_foo_.html`, false);
	
};

export const runNavigationHtmlVerificationTests = (): void => {
	describe("Navigation HTML Verification", () => {
		test("README", () => {
			const parsedHtml = parseHTMLOutputFile("./index.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group One", 2, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Page One", "pages/Group One/page-one.html", false);
				verifyPageProperties(navigation.groups[0].pages[1], "Page Two", "pages/Group One/page-two.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Two", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Page Three", "pages/Group Two/page-three.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section One", "pages/Group Two/Section One/Group Three/section-page-one.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 0);
		});

		test("Non-Parent Page", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group One/page-one.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group One", 2, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Page One", "page-one.html", true);
				verifyPageProperties(navigation.groups[0].pages[1], "Page Two", "page-two.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Two", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Page Three", "../Group Two/page-three.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section One", "../Group Two/Section One/Group Three/section-page-one.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 2);
		});

		test("Parent Page", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group One/page-two.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group One", 2, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Page One", "page-one.html", false);
				verifyPageProperties(navigation.groups[0].pages[1], "Page Two", "page-two.html", true, 2);
					verifyPageProperties(navigation.groups[0].pages[1].children[0], "Child One", "page-two/child-one.html", false);
					verifyPageProperties(navigation.groups[0].pages[1].children[1], "Child Two", "page-two/child-two.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Two", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Page Three", "../Group Two/page-three.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section One", "../Group Two/Section One/Group Three/section-page-one.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 2);
		});

		test("Child Page", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group One/page-two/child-one.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group One", 2, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Page One", "../page-one.html", false);
				verifyPageProperties(navigation.groups[0].pages[1], "Page Two", "../page-two.html", false, 2, true);
					verifyPageProperties(navigation.groups[0].pages[1].children[0], "Child One", "child-one.html", true);
					verifyPageProperties(navigation.groups[0].pages[1].children[1], "Child Two", "child-two.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Two", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Page Three", "../../Group Two/page-three.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section One", "../../Group Two/Section One/Group Three/section-page-one.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 3);
		});

		test("Non-Parent Page In Section", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group Two/Section One/Group Four/section-page-three.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group Three", 1, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Section Page One", "../Group Three/section-page-one.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Four", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Section Page Two", "section-page-two.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section Page Three", "section-page-three.html", true);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 4);
		});

		test("Parent Page In Section", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group Two/Section One/Group Four/section-page-two.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group Three", 1, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Section Page One", "../Group Three/section-page-one.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Four", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Section Page Two", "section-page-two.html", true, 1, false);
					verifyPageProperties(navigation.groups[1].pages[0].children[0], "Section Child One", "section-page-two/section-child-one.html", false);
				verifyPageProperties(navigation.groups[1].pages[1], "Section Page Three", "section-page-three.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 4);
		});

		test("Child Page In Section", () => {
			const parsedHtml = parseHTMLOutputFile("./pages/Group Two/Section One/Group Four/section-page-two/section-child-one.html");
			const navigation = new NavigationHelper(parsedHtml);

			expect(navigation.groups.length).toEqual(3);
			verifyGroupProperties(navigation.groups[0], "Group Three", 1, false, false);
				verifyPageProperties(navigation.groups[0].pages[0], "Section Page One", "../../Group Three/section-page-one.html", false);
			verifyGroupProperties(navigation.groups[1], "Group Four", 2, false, false);
				verifyPageProperties(navigation.groups[1].pages[0], "Section Page Two", "../section-page-two.html", false, 1, true);
					verifyPageProperties(navigation.groups[1].pages[0].children[0], "Section Child One", "section-child-one.html", true);
				verifyPageProperties(navigation.groups[1].pages[1], "Section Page Three", "../section-page-three.html", false);
			verifyReflectionsGroupProperties(navigation.groups[2], "Development API", 5);
		});
	});
};
