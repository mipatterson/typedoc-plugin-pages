import { OptionValidator } from "../../../src/options/option-validator";
import * as validationUtilities from "../../../src/options/validation-utilities";
import * as Constants from "../../../src/constants";

describe("OptionValidator", () => {
	let defaultOptionAndValidateIsArrayMock;
	let defaultOptionAndValidateIsBooleanMock;
	let defaultOptionAndValidateIsStringMock;

	let sut: OptionValidator;

	const minimalOptions = {
		groups: [],
	};

	beforeEach(() => {
		defaultOptionAndValidateIsArrayMock = jest.fn();
		defaultOptionAndValidateIsBooleanMock = jest.fn();
		defaultOptionAndValidateIsStringMock = jest.fn();
		(validationUtilities as any).defaultOptionAndValidateIsArray = defaultOptionAndValidateIsArrayMock;
		(validationUtilities as any).defaultOptionAndValidateIsBoolean = defaultOptionAndValidateIsBooleanMock;
		(validationUtilities as any).defaultOptionAndValidateIsString = defaultOptionAndValidateIsStringMock;

		sut = new OptionValidator();
	});

	describe("validate()", () => {
		it("validates enablePageLinks", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "enablePageLinks", Constants.DEFAULT_ENABLE_PAGE_LINKS);
		});

		it("validates enableSearch", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "enableSearch", Constants.DEFAULT_ENABLE_SEARCH);
		});

		it("validates failBuildOnInvalidPageLink", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "failBuildOnInvalidPageLink", Constants.DEFAULT_FAIL_BUILD_ON_INVALID_PAGE_LINK);
		});

		it("validates groups is array", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsArrayMock).toHaveBeenCalledWith(minimalOptions, "groups", []);
		});

		it("validates listInvalidPageLinks", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "listInvalidPageLinks", Constants.DEFAULT_LIST_INVALID_PAGE_LINKS);
		});

		it("validates output", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsStringMock).toHaveBeenCalledWith(minimalOptions, "output", Constants.DEFAULT_OUTPUT);
		});

		it("validates reflectionNavigationTitle", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsStringMock).toHaveBeenCalledWith(minimalOptions, "reflectionNavigationTitle", Constants.DEFAULT_REFLECTION_NAV_TITLE);
		});

		it("validates replaceGlobalsPage", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "replaceGlobalsPage", Constants.DEFAULT_REPLACE_GLOBALS_PAGE);
		});

		it("validates separatePluginNavigation", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsBooleanMock).toHaveBeenCalledWith(minimalOptions, "separatePluginNavigation", Constants.DEFAULT_SEPARATE_PLUGIN_NAVIGATION);
		});

		it("validates source", () => {
			sut.validate(minimalOptions);

			expect(defaultOptionAndValidateIsStringMock).toHaveBeenCalledWith(minimalOptions, "source", ".");
		});
	});
});
