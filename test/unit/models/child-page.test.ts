import { ChildPage, Page } from "../../../src/pages/models";
import { ChildPageDefinition } from "../../../src/options/models";
import { Mock, IMock, Times } from "typemoq";
import * as fs from "fs";
import * as path from "path";

describe("ChildPage", () => {
	let originalJoin: any;
	let joinMock: any;
	let definition: ChildPageDefinition;
	const parentDirectory = "./parent/directory";
	let parentMock: IMock<Page>;
	let parentChildrenMock: IMock<ChildPage[]>;

	let sut: ChildPage;

	beforeEach(() => {
		originalJoin = path.join;
		joinMock = jest.fn((p1: string, p2: string) => "joined/url");
		(path as any).join = joinMock;
		parentMock = Mock.ofType<Page>();
		parentChildrenMock = Mock.ofType<ChildPage[]>();
		parentMock.setup(m => m.children).returns(() => parentChildrenMock.object);

		definition = {
			title: "Title",
			source: "./source.md",
			output: "output.html",
		};

		sut = new ChildPage(definition, parentDirectory, parentMock.object);
	});

	afterEach(() => {
		(path as any).join = originalJoin;
	});

	describe("constructor()", () => {
		test("adds page to parent's children", () => {
			parentChildrenMock.verify(m => m.push(sut), Times.once());
		});
	});

	describe("title", () => {
		test("returns the title from the page definition", () => {
			expect(sut.title).toEqual(definition.title);
		});
	});

	describe("source", () => {
		test("returns the source path", () => {
			expect(sut.source).toBe(definition.source);
		});
	});

	describe("parent", () => {
		test("returns the parent page", () => {
			expect(sut.parent).toBe(parentMock.object);
		});
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
		});
	});

	describe("url", () => {
		test("returns the urlPrefix joined with the definition output", () => {
			expect(sut.url).toEqual("joined/url");
			expect(joinMock).toHaveBeenCalledWith(parentDirectory, definition.output);
		});
	});
});
