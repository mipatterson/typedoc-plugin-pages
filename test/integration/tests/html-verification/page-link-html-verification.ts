import { getPageLinks, PageLink } from "../../helpers/html-verification/page-link";
import { parseHTMLOutputFile } from "../../helpers/html-verification/html-parsing-helpers";

const parseLinks = (relativeFilePath: string): PageLink[] => {
	const parsedHtml = parseHTMLOutputFile(relativeFilePath);
	return getPageLinks(parsedHtml);
};

const verifyPageLink = (link: PageLink, expectedTitle: string, expectedHref: string): void => {
	expect(link.title).toEqual(expectedTitle);
	expect(link.href).toEqual(expectedHref);
};

const verifyPageLinks = (links: PageLink[], expectedTitle: string, expectedHref: string): void => {
	for (const link of links) {
		verifyPageLink(link, expectedTitle, expectedHref);
	}
};

const verifyAllPageLinks = (links: PageLink[], expectredHrefs: string[]): void => {
	verifyPageLinks([links[0], links[1]], "Group One", expectredHrefs[0]);
	verifyPageLinks([links[2], links[3]], "Page One", expectredHrefs[1]);
	verifyPageLinks([links[4], links[5]], "Page Two", expectredHrefs[2]);
	verifyPageLinks([links[6], links[7]], "Child One", expectredHrefs[3]);
	verifyPageLinks([links[8], links[9]], "Child Two", expectredHrefs[4]);
	verifyPageLinks([links[10], links[11]], "Group Two", expectredHrefs[5]);
	verifyPageLinks([links[12], links[13]], "Page Three", expectredHrefs[6]);
	// TODO: Add integration test for section page links once they are supported
	verifyPageLinks([links[16], links[17]], "Group Three", expectredHrefs[7]);
	verifyPageLinks([links[18], links[19]], "Section Page One", expectredHrefs[8]);
	verifyPageLinks([links[20], links[21]], "Group Four", expectredHrefs[9]);
	verifyPageLinks([links[22], links[23]], "Section Page Two", expectredHrefs[10]);
	verifyPageLinks([links[24], links[25]], "Section Child One", expectredHrefs[11]);
	verifyPageLinks([links[26], links[27]], "Section Page Three", expectredHrefs[12]);
};

export const runPageLinkHtmlVerificationTests = (): void => {
	describe("Page Link HTML Verification", () => {
		test("README", () => {
			const links = parseLinks("./index.html");
			verifyAllPageLinks(links, [
				"pages/Group One/page-one.html",
				"pages/Group One/page-one.html",
				"pages/Group One/page-two.html",
				"pages/Group One/page-two/child-one.html",
				"pages/Group One/page-two/child-two.html",
				"pages/Group Two/page-three.html",
				"pages/Group Two/page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"pages/Group Two/Section One/Group Three/section-page-one.html",
				"pages/Group Two/Section One/Group Three/section-page-one.html",
				"pages/Group Two/Section One/Group Four/section-page-two.html",
				"pages/Group Two/Section One/Group Four/section-page-two.html",
				"pages/Group Two/Section One/Group Four/section-page-two/section-child-one.html",
				"pages/Group Two/Section One/Group Four/section-page-three.html",
			]);
		});

		test("Non-Parent Page", () => {
			const links = parseLinks("./pages/Group One/page-one.html");
			verifyAllPageLinks(links, [
				"page-one.html",
				"page-one.html",
				"page-two.html",
				"page-two/child-one.html",
				"page-two/child-two.html",
				"../Group Two/page-three.html",
				"../Group Two/page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../Group Two/Section One/Group Three/section-page-one.html",
				"../Group Two/Section One/Group Three/section-page-one.html",
				"../Group Two/Section One/Group Four/section-page-two.html",
				"../Group Two/Section One/Group Four/section-page-two.html",
				"../Group Two/Section One/Group Four/section-page-two/section-child-one.html",
				"../Group Two/Section One/Group Four/section-page-three.html",
			]);
		});

		test("Parent Page", () => {
			const links = parseLinks("./pages/Group One/page-two.html");
			verifyAllPageLinks(links, [
				"page-one.html",
				"page-one.html",
				"page-two.html",
				"page-two/child-one.html",
				"page-two/child-two.html",
				"../Group Two/page-three.html",
				"../Group Two/page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../Group Two/Section One/Group Three/section-page-one.html",
				"../Group Two/Section One/Group Three/section-page-one.html",
				"../Group Two/Section One/Group Four/section-page-two.html",
				"../Group Two/Section One/Group Four/section-page-two.html",
				"../Group Two/Section One/Group Four/section-page-two/section-child-one.html",
				"../Group Two/Section One/Group Four/section-page-three.html",
			]);
		});

		test("Child Page", () => {
			const links = parseLinks("./pages/Group One/page-two/child-one.html");
			verifyAllPageLinks(links, [
				"../page-one.html",
				"../page-one.html",
				"../page-two.html",
				"child-one.html",
				"child-two.html",
				"../../Group Two/page-three.html",
				"../../Group Two/page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../../Group Two/Section One/Group Three/section-page-one.html",
				"../../Group Two/Section One/Group Three/section-page-one.html",
				"../../Group Two/Section One/Group Four/section-page-two.html",
				"../../Group Two/Section One/Group Four/section-page-two.html",
				"../../Group Two/Section One/Group Four/section-page-two/section-child-one.html",
				"../../Group Two/Section One/Group Four/section-page-three.html",
			]);
		});

		test("Non-Parent Page In Section", () => {
			const links = parseLinks("./pages/Group Two/Section One/Group Four/section-page-three.html");
			verifyAllPageLinks(links, [
				"../../../Group One/page-one.html",
				"../../../Group One/page-one.html",
				"../../../Group One/page-two.html",
				"../../../Group One/page-two/child-one.html",
				"../../../Group One/page-two/child-two.html",
				"../../page-three.html",
				"../../page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../Group Three/section-page-one.html",
				"../Group Three/section-page-one.html",
				"section-page-two.html",
				"section-page-two.html",
				"section-page-two/section-child-one.html",
				"section-page-three.html",
			]);
		});

		test("Parent Page In Section", () => {
			const links = parseLinks("./pages/Group Two/Section One/Group Four/section-page-two.html");
			verifyAllPageLinks(links, [
				"../../../Group One/page-one.html",
				"../../../Group One/page-one.html",
				"../../../Group One/page-two.html",
				"../../../Group One/page-two/child-one.html",
				"../../../Group One/page-two/child-two.html",
				"../../page-three.html",
				"../../page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../Group Three/section-page-one.html",
				"../Group Three/section-page-one.html",
				"section-page-two.html",
				"section-page-two.html",
				"section-page-two/section-child-one.html",
				"section-page-three.html",
			]);
		});

		test("Child Page In Section", () => {
			const links = parseLinks("./pages/Group Two/Section One/Group Four/section-page-two/section-child-one.html");
			verifyAllPageLinks(links, [
				"../../../../Group One/page-one.html",
				"../../../../Group One/page-one.html",
				"../../../../Group One/page-two.html",
				"../../../../Group One/page-two/child-one.html",
				"../../../../Group One/page-two/child-two.html",
				"../../../page-three.html",
				"../../../page-three.html",
				// TODO: Add integration test for section page links once they are supported
				"../../Group Three/section-page-one.html",
				"../../Group Three/section-page-one.html",
				"../section-page-two.html",
				"../section-page-two.html",
				"section-child-one.html",
				"../section-page-three.html",
			]);
		});
	});
};
