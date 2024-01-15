import { writable } from "svelte/store";

export let mediaLibrary = writable<Medias>()

export let settings = writable<Settings>()
