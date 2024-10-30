/**
 * # Permissions
 * @example 
 * "permissions": [
			"fs:default",
			"fs:allow-exists",
			"fs:allow-create",
			"fs:allow-write-text-file",
			"fs:allow-read-text-file",
			"fs:allow-remove",
			{
				"identifier": "fs:scope",
				"allow": [{ "path": "$APPDATA" }, { "path": "$APPDATA/**" }]
			}
		]
 */

import {
	exists,
	BaseDirectory,
	create,
	writeTextFile,
	readTextFile,
	remove,
	mkdir
} from '@tauri-apps/plugin-fs';

export class Store<T extends Record<string, unknown>> {
	public readonly fileName: string;
	public content: T = {} as T;
	public baseDir: BaseDirectory;
	private readonly file: string;

	/**
	 * Creates a new Store instance.
	 * @param {string} fileName - The name of the file to be managed.
	 * @param {BaseDirType} [baseDir="AppConfig"] - The base directory where the file is stored (e.g., "AppConfig").
	 */
	constructor(fileName: string, baseDir: BaseDirType = 'AppConfig') {
		this.baseDir = BaseDirectory[baseDir]; // Correct mapping from string to BaseDirectory enum.
		this.fileName = fileName;
		this.file = `${baseDir}\\${fileName}`;
	}

	/**
	 * Loads the content of the store from the file system.
	 * If the file does not exist, it creates a new one and returns an empty object.
	 * @returns {Promise<T>} The content of the store or an empty object.
	 */
	async load(): Promise<T> {
		// Gibt es App identifier (seenivers)
		if (!(await exists('', { baseDir: BaseDirectory.AppConfig }))) {
			await mkdir('', { baseDir: BaseDirectory.AppConfig, recursive: true });
		}

		if (await exists(this.fileName, { baseDir: BaseDirectory.AppConfig })) {
			const content = await readTextFile(this.fileName, {
				baseDir: BaseDirectory.AppConfig
			});

			// Überprüfe, ob der Inhalt leer ist oder nur Whitespace enthält
			if (content.trim()) {
				this.content = JSON.parse(content) as T;
				return this.content;
			} else {
				// Falls die Datei leer ist, gib ein leeres Objekt zurück
				this.content = {} as T;
				return this.content;
			}
		} else {
			await this.create();
			return {} as T;
		}
	}

	/**
	 * Creates a new file in the store if it does not exist.
	 * @private
	 * @returns {Promise<void | Error>} Returns an error if file creation fails.
	 */
	private async create(): Promise<void | Error> {
		if (!(await exists(this.fileName, { baseDir: BaseDirectory.AppConfig }))) {
			await create(this.fileName, { baseDir: BaseDirectory.AppConfig });
			await this.save();
		}
	}

	/**
	 * Saves the current content of the store to the file system.
	 * If the file does not exist, it will be created.
	 * @returns {Promise<void>}
	 */
	async save(): Promise<void> {
		if (!(await exists(this.fileName, { baseDir: BaseDirectory.AppConfig }))) {
			await this.create();
		}

		const contents = JSON.stringify(this.content);

		await writeTextFile(this.fileName, contents, {
			baseDir: BaseDirectory.AppConfig
		});
	}

	/**
	 * Removes the store file from the file system.
	 * @returns {Promise<boolean>} Returns true if the file does not exist or was successfully removed.
	 */
	async remove(): Promise<boolean> {
		if (!(await exists(this.fileName, { baseDir: BaseDirectory.AppConfig }))) {
			return true;
		}
		await remove(this.fileName, { baseDir: BaseDirectory.AppConfig });
		return true;
	}
}

/**
 * Defines the base directory options.
 */
type BaseDirType =
	| 'Audio'
	| 'Cache'
	| 'Config'
	| 'Data'
	| 'LocalData'
	| 'Document'
	| 'Download'
	| 'Picture'
	| 'Public'
	| 'Video'
	| 'Resource'
	| 'Temp'
	| 'AppConfig'
	| 'AppData'
	| 'AppLocalData'
	| 'AppCache'
	| 'AppLog'
	| 'Desktop'
	| 'Executable'
	| 'Font'
	| 'Home'
	| 'Runtime'
	| 'Template';
