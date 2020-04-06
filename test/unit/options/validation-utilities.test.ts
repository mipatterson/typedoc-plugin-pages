import * as sut from "../../../src/options/validation-utilities";

interface ValidationTestCase {
	typeName: string;
	value: any;
}

const testCases: ValidationTestCase[] = [
	{
		typeName: "number (negative)",
		value: -9,
	},
	{
		typeName: "number (negative decimal)",
		value: -1.5,
	},
	{
		typeName: "number (negative 1)",
		value: -1,
	},
	{
		typeName: "number (zero)",
		value: 0,
	},
	{
		typeName: "number (1)",
		value: 1,
	},
	{
		typeName: "number (decimal)",
		value: 1.5,
	},
	{
		typeName: "number (positive)",
		value: 9,
	},
	{
		typeName: "string (empty)",
		value: "",
	},
	{
		typeName: "string (non-empty)",
		value: "test",
	},
	{
		typeName: "boolean (true)",
		value: true,
	},
	{
		typeName: "boolean (false)",
		value: false,
	},
	{
		typeName: "Date",
		value: new Date(),
	},
	{
		typeName: "undefined",
		value: undefined,
	},
	{
		typeName: "null",
		value: null,
	},
	{
		typeName: "object",
		value: {},
	},
	{
		typeName: "function",
		value: function(): void { /* noop */ },
	},
	{
		typeName: "array (empty)",
		value: [],
	},

	{
		typeName: "array (non-empty)",
		value: [1, 2, 3],
	},
];

fdescribe("Validation Utilties", () => {
	describe("defaultOptionIfUndefined()", () => {
		for (const testCase of testCases) {
			if (testCase.value === undefined) {
				test("defaults the value if it is undefined", () => {
					const input = { test: testCase.value };
					sut.defaultOptionIfUndefined(input, "test", "defaultValue");
	
					expect(input.test).toEqual("defaultValue");
				});
			} else if (testCase.value === null) {
				test("defaults the value if it is null", () => {
					const input = { test: testCase.value };
					sut.defaultOptionIfUndefined(input, "test", "defaultValue");
	
					expect(input.test).toEqual("defaultValue");
				});
			} else {
				test("does nothing if the property is defined", () => {
					const input = { test: testCase.value };
					sut.defaultOptionIfUndefined(input, "test", "defaultValue");
	
					expect(input.test).toEqual(testCase.value);
				});
			}
		}
	});

	describe("validateOptionIsArray()", () => {
		const expectedError = `Option "test" must be an array.`;
		for (const testCase of testCases) {
			if (Array.isArray(testCase.value)) {
				test(`does nothing if the property is a ${testCase.typeName}`, () => {
					sut.validateOptionIsArray({ test: testCase.value }, "test");
				});
			} else {
				test(`throws an error if the property is a ${testCase.typeName}`, () => {
					expect(() => sut.validateOptionIsArray({ test: testCase.value }, "test")).toThrowError(expectedError);
				});
			}
		}
	});

	describe("validateOptionIsBoolean()", () => {
		const expectedError = `Option "test" must be a boolean.`;
		for (const testCase of testCases) {
			if (typeof testCase.value === "boolean") {
				test(`does nothing if the property is a ${testCase.typeName}`, () => {
					sut.validateOptionIsBoolean({ test: testCase.value }, "test");
				});
			} else {
				test(`throws an error if the property is a ${testCase.typeName}`, () => {
					expect(() => sut.validateOptionIsBoolean({ test: testCase.value }, "test")).toThrowError(expectedError);
				});
			}
		}
	});

	describe("validateOptionIsString()", () => {
		const expectedError = `Option "test" must be a string.`;
		for (const testCase of testCases) {
			if (typeof testCase.value === "string") {
				test(`does nothing if the property is a ${testCase.typeName}`, () => {
					sut.validateOptionIsString({ test: testCase.value }, "test");
				});
			} else {
				test(`throws an error if the property is a ${testCase.typeName}`, () => {
					expect(() => sut.validateOptionIsString({ test: testCase.value }, "test")).toThrowError(expectedError);
				});
			}
		}
	});
});
