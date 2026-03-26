<script lang="ts">
	import { seeniversURL } from '$lib';
	import { api } from '$lib/trpc';
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { getUserSession, setUserSession } from '$lib/utils/auth/session';

	let email: string;
	let password: string;
	let error: string;
	let loading = false;
	let session = getUserSession();

	const LOCALSTORAGE_KEY = 'userSession';

	// Prüfen beim Laden, ob Sitzung existiert und nicht abgelaufen ist
	onMount(() => {
		session = getUserSession();
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			await api.auth.login.mutate({ email, password });
			session = setUserSession();

			goto(resolve('/'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	async function logout() {
		try {
			await api.auth.logout.mutate();
		} catch (err) {
			console.warn('Logout failed', err);
		}
		localStorage.removeItem(LOCALSTORAGE_KEY);
		session.loggedIn = false;
		session.expiry = 0;
	}
</script>

<main class="flex grow flex-col items-center justify-center py-5">
	<h1 class="text-primary mb-3 text-5xl font-bold">{m.loginTitle()}</h1>

	{#if session.loggedIn}
		<p class="mb-3 text-green-600">
			Sie sind angemeldet. Sitzung läuft ab am {session.expiry
				? new Date(session.expiry).toLocaleString()
				: ''}
		</p>
	{/if}

	<form onsubmit={login} class="bg-base-100 grid w-80 gap-3 rounded-xl p-5">
		<label class="form-control w-full max-w-md">
			<span class="label-text label">{m.loginEmail()}</span>
			<input
				type="email"
				name="email"
				class="input-bordered input w-full max-w-md"
				bind:value={email}
				disabled={session.loggedIn}
				required
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<span class="label-text label">{m.loginPassword()}</span>
			<input
				type="password"
				name="password"
				class="input-bordered input w-full max-w-xs"
				bind:value={password}
				disabled={session.loggedIn}
				required
			/>
		</label>

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}

		<button type="submit" class="btn" disabled={loading || session.loggedIn}>
			{m.loginLogin()}
		</button>

		{#if session.loggedIn}
			<button type="button" class="btn btn-warning mt-2" onclick={logout}> Abmelden </button>
		{/if}

		<hr class="border-base-content/50 my-2" />

		<a href={seeniversURL + '/register'} rel="external" target="_blank" class="btn">
			{m.registerRegister()}
		</a>
	</form>
</main>
