import * as compareVersions from "compare-versions";
import { Browser, launch, Page } from "puppeteer";
import { DocumentationHost } from "../helpers/hosting-helper";
import { SearchPageObject, SearchResult } from "../helpers/page-objects/search-page-object";

const PORT = 9000;

const expectParentToBe = (searchResult: SearchResult, expectedParent: string, typeDocVersion: string): void => {
	if (compareVersions(typeDocVersion, "0.17.4") >= 0) {
		expectedParent = "";
	}
	expect(searchResult.parent).toEqual(expectedParent);
};

export const runSearchIntegrationTests = (typeDocVersion: string): void => {
	describe("Search Integration", () => {
		let host: DocumentationHost;
		let browser: Browser;
		let page: Page;
		let searchPO: SearchPageObject;

		beforeAll(async () => {
			host = new DocumentationHost();
			host.listen(PORT);
			browser = await launch();
			page = await browser.newPage();
			await page.goto(`http://localhost:${PORT}/index.html`);
			searchPO = new SearchPageObject(page);
		});

		afterAll(async () => {
			await browser.close();
			await host.stop();
		});

		test("Unique Term Search", async () => {
			const results = await searchPO.search("Lorem");
			expect(results.length).toEqual(1);
			expect(results[0].href).toEqual(`http://localhost:${PORT}/pages/Group%20One/page-two/child-two.html`);
			expect(results[0].kind).toEqual("page");
			expect(results[0].name).toEqual("Child Two");
			expectParentToBe(results[0], "Page Two", typeDocVersion);
		});

		test("Non-Unique Term Search", async () => {
			const results = await searchPO.search("at");
			expect(results.length).toEqual(2);
			expect(results[0].href).toEqual(`http://localhost:${PORT}/pages/Group%20One/page-two/child-two.html`);
			expect(results[0].kind).toEqual("page");
			expect(results[0].name).toEqual("Child Two");
			expectParentToBe(results[0], "Page Two", typeDocVersion);
			expect(results[1].href).toEqual(`http://localhost:${PORT}/pages/Group%20One/page-one.html`);
			expect(results[1].kind).toEqual("page");
			expect(results[1].name).toEqual("Page One");
			expectParentToBe(results[1], "Group One", typeDocVersion);
		});

		test("Weighted Content Search", async () => {
			const results = await searchPO.search("Foo");
			expect(results.length).toEqual(7);
			expect(results[0].href).toEqual(`http://localhost:9000/pages/Group%20Two/Section%20One/Group%20Three/section-page-one.html`);
			expect(results[0].kind).toEqual("page");
			expect(results[0].name).toEqual("Section Page One");
			expectParentToBe(results[0], "Group Three", typeDocVersion);
			expect(results[1].href).toEqual(`http://localhost:9000/classes/_bar_.bar.html#_foo`);
			expect(results[1].kind).toEqual("property");
			expect(results[1].name).toEqual("_foo");
			expect(results[1].parent).toEqual(`"bar".Bar`);
		});
	});
};
