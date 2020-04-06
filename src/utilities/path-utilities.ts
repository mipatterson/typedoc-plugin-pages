/**
 * @packageDocumentation
 * @module Utilities
 */

import { basename, dirname, extname, join, relative } from "path";

/**
 * Gets the file extension of the passed in file name or path
 * @param path Path to get the file extension from
 * @returns File extension
 */
export function getFileExtension(path: string): string {
	return extname(path);
}

/**
 * Gets the file name of the provided path, while optionally trimming the file extension
 * @param path File path to retrieve the name for
 * @param trimExtension Whether or not to trim the extension from the file name (defaults to false)
 * @returns The file name from the path
 */
export function getFilename(path: string, trimExtension = false): string {
	let filename = basename(path);

	if (trimExtension) {
		const ext = getFileExtension(path);
		filename = filename.substr(0, filename.length - ext.length);
	}

	return filename;
}

/**
 * Updates the provided path to make sure it ends with the provided file extension
 * @param path File path
 * @param extension File extension
 * @returns The passed in path with the provided file extension
 */
export function ensurePathHasExtension(path: string, extension: string): string {
	const existingExt = getFileExtension(path);

	if (existingExt !== extension) {
		return getFilename(path, true) + extension;
	}

	return path;
}

/**
 * Converts the provided absolute URL to a URL relative to the current page's URL
 * @param absoluteUrl Absolute URL to convert to a relative URL
 * @param relativeTo URL to make the URL relative to
 * @returns The converted URL
 */
export function getRelativeUrl(absoluteUrl: string, relativeTo: string): string {
	if (/^(http|ftp)s?:\/\//.test(absoluteUrl)) {
		return absoluteUrl;
	} else {
		const rel = relative(dirname(relativeTo), dirname(absoluteUrl));
		return join(rel, basename(absoluteUrl)).replace(/\\/g, '/');
	}
}
