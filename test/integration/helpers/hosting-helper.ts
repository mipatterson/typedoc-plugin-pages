import { join } from "path";
import * as serveStatic from "serve-static";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connect = require("connect");

/**
 * Helper class for locally hosting the documentation for integration tests
 */
export class DocumentationHost {
	private _server: any;

	/**
	 * Starts the server listening on the provided port
	 * @param port Port to listen on
	 */
	public listen(port: number): void {
		this._server = ((connect() as any).use(serveStatic(join(__dirname, "../project/dist/")) as any)).listen(port);
	}

	/**
	 * Stops the server
	 */
	public stop(): Promise<void> {
		return new Promise<void>(res => {
			this._server.close(() => res);
		});
	}
}