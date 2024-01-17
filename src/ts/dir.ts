import { BaseDirectory, createDir, exists, readDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { mediaLibrary, settings } from "./db";
import { get } from "svelte/store";

const MEDIA_FILE = "media.json";
const EMPTY_MEDIA: Medias = [];
const SETTINGS_FILE = "settings.json";
const EMPTY_SETTINGS: Settings = {
    language: navigator.language,
    keywords: []
};

export async function load() {
    // Gibt es AppData
    try {
        await readDir("", { dir: BaseDirectory.AppData });
    } catch (error) {
        console.error("Appconfig", false, "creating", error);
        await createDir("", { dir: BaseDirectory.AppData });
    }

    // Lade Settings
    if (await exists(SETTINGS_FILE, { dir: BaseDirectory.AppData })) {
        try {
            settings.set(JSON.parse(await readTextFile(SETTINGS_FILE, { dir: BaseDirectory.AppData })));
        } catch (error) {
            console.error("Keine Daten gefunden");
            settings.set(EMPTY_SETTINGS);
            save();
        }
    } else {
        settings.set(EMPTY_SETTINGS);
        save();
    }

    // Lade Media Library
    if (await exists(MEDIA_FILE, { dir: BaseDirectory.AppData })) {
        try {
            mediaLibrary.set(JSON.parse(await readTextFile(MEDIA_FILE, { dir: BaseDirectory.AppData })));
        } catch (error) {
            console.error("Keine Daten gefunden");
            mediaLibrary.set(EMPTY_MEDIA);
            save();
        }
    } else {
        mediaLibrary.set(EMPTY_MEDIA);
        save();
    }
}

export async function save() {
    // Gibt es MEDIA_FILE
    try {
        await exists(MEDIA_FILE, { dir: BaseDirectory.AppData });
    } catch (error) {
        console.error("creating directory", error);
        await createDir("", { dir: BaseDirectory.AppData });
    }

    // Sepichere Media Library
    try {
        await writeTextFile(MEDIA_FILE, JSON.stringify(get(mediaLibrary)), { dir: BaseDirectory.AppData });
        console.log("Daten wurden gespeichert");
    } catch (error) {
        throw error;
    }

    // Gibt es SETTINGS_FILE
    try {
        await exists(SETTINGS_FILE, { dir: BaseDirectory.AppData });
    } catch (error) {
        console.error("creating directory", error);
        await createDir("", { dir: BaseDirectory.AppData });
    }

    // Sepichere Settings
    try {
        await writeTextFile(SETTINGS_FILE, JSON.stringify(get(settings)), { dir: BaseDirectory.AppData });
        console.log("Settings wurden gespeichert");
    } catch (error) {
        throw error;
    }
}
