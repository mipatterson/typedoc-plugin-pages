import { readFileSync } from "fs-extra";
import { JSDOM } from "jsdom";
import { buildHTMLOutputPath } from "../html-output-path-helpers";

/**
 * Parses the provided file using JSDOM
 * @param relativeFilePath Relative path of the file
 * @returns JSDOM object
 */
export const parseHTMLOutputFile = (relativeFilePath: string): JSDOM => {
	const filePath = buildHTMLOutputPath(relativeFilePath);
	const fileContents = readFileSync(filePath);
	return new JSDOM(fileContents);
};