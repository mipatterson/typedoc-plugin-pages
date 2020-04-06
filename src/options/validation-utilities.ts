/**
 * @packageDocumentation
 * @module Options
 */

/**
 * Ensures that a given property on a given object is not null or undefined, and defaults the value if necessary
 *
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 * @param defaultValue Default value to use if the property is null or undefined
 */
export function defaultOptionIfUndefined<T>(obj: T, propertyName: keyof T, defaultValue: any): void {
	if (obj[propertyName] === undefined || obj[propertyName] === null) {
		obj[propertyName] = defaultValue;
	}
}

/**
 * Validates that a given property on a given object is an array
 * 
 * This will throw an error if the property is not an array.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function validateOptionIsArray<T>(obj: T, propertyName: keyof T): void {
	if (!Array.isArray(obj[propertyName])) {
		throw new Error(`Option "${propertyName}" must be an array.`);
	}
}


/**
 * Validates that a given property on a given object is a boolean
 * 
 * This will throw an error if the property is not a boolean.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function validateOptionIsBoolean<T>(obj: T, propertyName: keyof T): void {
	if (typeof(obj[propertyName]) !== "boolean") {
		throw new Error(`Option "${propertyName}" must be a boolean.`);
	}
}

/**
 * Validates that a given property on a given object is a string
 * 
 * This will throw an error if the property is not a a string.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function validateOptionIsString<T>(obj: T, propertyName: keyof T): void {
	if (typeof(obj[propertyName]) !== "string") {
		throw new Error(`Option "${propertyName}" must be a string.`);
	}
}

/**
 * Defaults the property and validates that it is an array
 * 
 * This will throw an error if the property is not an array after defaulting.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function defaultOptionAndValidateIsArray<T, V>(obj: T, propertyName: keyof T, defaultValue: Array<V>): void {
	defaultOptionIfUndefined<T>(obj, propertyName, defaultValue);
	validateOptionIsArray<T>(obj, propertyName);
}

/**
 * Defaults the property and validates that it is a boolean
 * 
 * This will throw an error if the property is not a boolean after defaulting.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function defaultOptionAndValidateIsBoolean<T>(obj: T, propertyName: keyof T, defaultValue: boolean): void {
	defaultOptionIfUndefined<T>(obj, propertyName, defaultValue);
	validateOptionIsBoolean<T>(obj, propertyName);
}

/**
 * Defaults the property and validates that it is a string
 * 
 * This will throw an error if the property is not a string after defaulting.
 * @param obj Object to check for the property on
 * @param propertyName Name of the property to check
 */
export function defaultOptionAndValidateIsString<T>(obj: T, propertyName: keyof T, defaultValue: string): void {
	defaultOptionIfUndefined<T>(obj, propertyName, defaultValue);
	validateOptionIsString<T>(obj, propertyName);
}
