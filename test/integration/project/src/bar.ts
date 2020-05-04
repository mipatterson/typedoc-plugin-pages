import { Foo } from "./foo";

export class Bar implements Foo {
	/**
	 * This is a public number property.
	 * @category Category One
	 */
	public bar: number;

	private _foo: string;

	/**
	 * Creates an instance of Bar
	 * @param foo Foo
	 */
	constructor(foo: string) {
		this._foo = foo;
	}

	/**
	 * Get the foo
	 * @category Category One
	 */
	public get foo(): string {
		return this._foo;
	}

	/**
	 * Update the foo
	 * @category Category Two
	 */
	public set foo(newFoo: string) {
		this._foo = newFoo;
	}

	/**
	 * Logs foobar
	 * @category Category One
	 */
	public foobar(): void {
		console.log("foobar");
	}

	public someMethod(): number {
		return 42;
	}
}