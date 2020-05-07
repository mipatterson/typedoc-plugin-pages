import { executeTypeDocWithPlugin } from "./execute-with-plugin";
import { executeTypeDocWithoutPlugin } from "./execute-without-plugin";

export const runTypeDocExecutionTests = (): void => {
	describe("TypeDoc Execution", () => {
		executeTypeDocWithoutPlugin();
		executeTypeDocWithPlugin();
	});
};