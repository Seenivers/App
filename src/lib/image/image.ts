import { imageURL, placeholderURL } from '$lib';
import { api } from '$lib/trpc';
import { convertFileSrc } from '@tauri-apps/api/core';
import { create, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { online } from 'svelte/reactivity/window';

/**
 * Root: AppData/images
 */
const IMAGE_ROOT = 'images';

type ImageCategory = 'actors' | 'backdrops' | 'posters' | null;

/* -------------------------------------------------- */
/* PATH HELPERS                                        */
/* -------------------------------------------------- */

function isValidFile(file: unknown): file is string {
	return typeof file === 'string' && file.trim().length > 0 && !file.startsWith('data:');
}

async function getLocalDir(category: ImageCategory) {
	const base = category ? `${IMAGE_ROOT}/${category}` : IMAGE_ROOT;
	return join(await appDataDir(), base);
}

async function getLocalFilePath(file: string, category: ImageCategory) {
	return join(await getLocalDir(category), file);
}

async function ensureDir(path: string) {
	if (!path || typeof path !== 'string' || path.trim() === '') {
		console.warn('ensureDir blocked empty path');
		return;
	}

	if (!(await exists(path))) {
		await mkdir(path, { recursive: true });
	}
}

async function fileExists(path: string) {
	return await exists(path);
}

/* -------------------------------------------------- */
/* IMAGE DIMENSIONS                                   */
/* -------------------------------------------------- */

async function fetchImageDimensions(src: string): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			resolve({ width: img.width, height: img.height });
		};

		img.onerror = async (err) => {
			if (img.width === 0 || img.height === 0) {
				// optional cleanup for corrupted asset URLs
				try {
					const cleaned = decodeURIComponent(src.replace('http://asset.localhost/', ''));

					if (await fileExists(cleaned)) {
						await remove(cleaned);
					}
				} catch {
					// ignore cleanup errors
				}

				return resolve({ width: 300, height: 450 });
			}

			reject(
				new Error(`Image load failed: ${err instanceof ErrorEvent ? err.message : String(err)}`)
			);
		};

		img.src = src;
	});
}

/* -------------------------------------------------- */
/* RESOLVERS                                          */
/* -------------------------------------------------- */

async function resolveImage(src: string) {
	const { width, height } = await fetchImageDimensions(src).catch(() => ({
		width: 300,
		height: 450
	}));

	return { src, width, height };
}

async function resolvePlaceholder() {
	return resolveImage(placeholderURL);
}

async function resolveRemote(url: string) {
	const proxyResult = await api.image.query({ url }).catch(() => null);

	if (!proxyResult) {
		return resolvePlaceholder();
	}

	const blob = new Blob([new Uint8Array(proxyResult.data)], {
		type: proxyResult.contentType ?? 'application/octet-stream'
	});

	const objectUrl = URL.createObjectURL(blob);

	return resolveImage(objectUrl);
}

/* -------------------------------------------------- */
/* DOWNLOAD                                           */
/* -------------------------------------------------- */

async function downloadToLocal(remoteUrl: string, localPath: string) {
	const result = await api.image.query({ url: remoteUrl }).catch(() => null);
	if (!result) return false;

	const dir = localPath.substring(0, localPath.lastIndexOf('/'));

	if (!dir) return false;

	await ensureDir(dir);

	const file = await create(localPath);
	await file.write(new Uint8Array(result.data));
	await file.close();

	return true;
}

/* -------------------------------------------------- */
/* PUBLIC API                                         */
/* -------------------------------------------------- */

export async function image(
	file: string | null | undefined,
	category: ImageCategory = null,
	download = false
) {
	if (!isValidFile(file)) {
		return resolvePlaceholder();
	}

	const cleanFile = file.replace(/^\/+/, '');
	const localPath = await getLocalFilePath(cleanFile, category);

	const existsLocally = await fileExists(localPath);

	/* 1. LOCAL */
	if (existsLocally) {
		const localUrl = convertFileSrc(localPath);
		return resolveImage(localUrl);
	}

	const remoteUrl = `${imageURL}${file}`;

	/* 2. OFFLINE */
	if (!online.current) {
		return resolvePlaceholder();
	}

	/* 3. OPTIONAL DOWNLOAD */
	if (download) {
		await downloadToLocal(remoteUrl, localPath);

		if (await fileExists(localPath)) {
			return resolveImage(convertFileSrc(localPath));
		}
	}

	/* 4. FALLBACK (PROXY / BLOB) */
	return resolveRemote(remoteUrl);
}
