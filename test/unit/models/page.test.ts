import { Page, PageGroup } from "../../../src/pages/models";
import { PageDefinition } from "../../../src/options/models";
import { Mock, IMock, Times } from "typemoq";
import * as fs from "fs";
import * as path from "path";

describe("Page", () => {
	let originalJoin: any;
	let joinMock: any;
	let definition: PageDefinition;
	const groupUrl = "./group/directory";
	let parentMock: IMock<PageGroup>;
	let parentPagesMock: IMock<Page[]>;

	let sut: Page;

	beforeEach(() => {
		originalJoin = path.join;
		joinMock = jest.fn((p1: string, p2: string) => "joined/url");
		(path as any).join = joinMock;
		parentMock = Mock.ofType<PageGroup>();
		parentMock.setup(m => m.url).returns(() => groupUrl);
		parentPagesMock = Mock.ofType<Page[]>();
		parentMock.setup(m => m.pages).returns(() => parentPagesMock.object);

		definition = {
			title: "Title",
			source: "./source.md",
			output: "output.html",
		};

		sut = new Page(definition, parentMock.object);
	});

	afterEach(() => {
		(path as any).join = originalJoin;
	});

	describe("constructor()", () => {
		test("adds page to parent's pages", () => {
			parentPagesMock.verify(m => m.push(sut), Times.once());
		})
	});

	describe("title", () => {
		test("returns the title from the page definition", () => {
			expect(sut.title).toEqual(definition.title);
		});
	});

	describe("source", () => {
		test("returns the source path", () => {
			expect(sut.source).toBe(definition.source);
		})
	});

	describe("parent", () => {
		test("returns the parent group", () => {
			expect(sut.parent).toBe(parentMock.object);
		})
	});

	describe("contents", () => {
		let originalReadFileSync: any;

		beforeEach(() => {
			originalReadFileSync = fs.readFileSync;
		});

		afterEach(() => {
			(fs as any).readFileSync = originalReadFileSync;
		});
		
		test("returns the contents of the file", () => {
			const readFileSyncMock = jest.fn();
			readFileSyncMock.mockReturnValue("file contents");
			(fs as any).readFileSync = readFileSyncMock;

			expect(sut.contents).toBe("file contents");
			expect(readFileSyncMock).toHaveBeenCalledWith(definition.source, "utf8");
		});

		it("throws an error when the file cannot be read", () => {
			const readFileSyncMock = jest.fn(() => { throw new Error(); });
			(fs as any).readFileSync = readFileSyncMock;

			expect(() => sut.contents).toThrow();
		})
				
		test("returns the contents of the file with title substitution", () => {
			const readFileSyncMock = jest.fn();
			readFileSyncMock.mockReturnValue("# Title\nfile contents");
			(fs as any).readFileSync = readFileSyncMock;

			sut.computeTitle();
			expect(sut.contents).toBe("file contents");
			console.log(sut.title);
			expect(sut.title).toBe("Title");
			expect(readFileSyncMock).toHaveBeenCalledWith(definition.source, "utf8");
		});
	});

	describe("url", () => {
		test("returns the urlPrefix joined with the definition output", () => {
			expect(sut.url).toEqual("joined/url");
			expect(joinMock).toHaveBeenCalledWith(groupUrl, definition.output);
		});
	});

	describe("children", () => {
		test("returns empty array", () => {
			expect(Array.isArray(sut.children)).toBe(true);
			expect(sut.children.length).toEqual(0);
		});
	});
});
