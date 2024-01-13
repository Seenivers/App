import { BaseDirectory, createDir, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { mediaLibrary } from "./db";
import { get } from "svelte/store";

const SETTINGS_FILE = "media.json";
const EMPTY_SETTINGS: Medias = []

export async function load() {
    try {
        await readDir("", { dir: BaseDirectory.AppData })
        // console.log("Appconfig", true);
    } catch (error) {
        console.error("Appconfig", false, "creating", error);
        await createDir("", { dir: BaseDirectory.AppData })
        // console.log(true);
    }

    if (await exists(SETTINGS_FILE, { dir: BaseDirectory.AppData })) {
        // console.log(SETTINGS_FILE, true);
        try {
            mediaLibrary.set(JSON.parse(await readTextFile(SETTINGS_FILE, { dir: BaseDirectory.AppData })))
        } catch (error) {
            console.error("Keine Daten gefunden");
            mediaLibrary.set(EMPTY_SETTINGS)
            save()
        }
    } else {
        // console.log(SETTINGS_FILE, `creating ${SETTINGS_FILE}`);
        mediaLibrary.set(EMPTY_SETTINGS)
        save()
        // console.log(SETTINGS_FILE, true);
    }
    // console.log(get(mediaLibrary));
}


export async function save() {
    try {
        await exists(SETTINGS_FILE, { dir: BaseDirectory.AppData })
    } catch (error) {
        console.error("creating directory", error);
        await createDir("", { dir: BaseDirectory.AppData });
    }

    try {
        await writeTextFile(SETTINGS_FILE, JSON.stringify(get(mediaLibrary)), { dir: BaseDirectory.AppData });
        console.log("Daten wurden gespeichert");
    } catch (error) {
        throw error;
    }

}
