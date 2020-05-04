import { join } from "path";

export const buildHTMLOutputPath = (relativeFilePath: string): string => {
	return join("./test/integration/project/dist", relativeFilePath);
};