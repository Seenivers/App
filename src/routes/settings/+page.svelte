<script lang="ts">
	import { onDestroy } from 'svelte';
	import { settings } from '../../ts/db';
	import { save } from '../../ts/dir';

	const languageNames = [
		{ name: 'Afrikaans', value: 'af-ZA' },
		{ name: 'Arabic (United Arab Emirates)', value: 'ar-AE' },
		{ name: 'Arabic (Saudi Arabia)', value: 'ar-SA' },
		{ name: 'Belarusian', value: 'be-BY' },
		{ name: 'Bulgarian', value: 'bg-BG' },
		{ name: 'Bengali', value: 'bn-BD' },
		{ name: 'Catalan', value: 'ca-ES' },
		{ name: 'Chamorro', value: 'ch-GU' },
		{ name: 'Chinese', value: 'cn-CN' },
		{ name: 'Czech', value: 'cs-CZ' },
		{ name: 'Welsh', value: 'cy-GB' },
		{ name: 'Danish', value: 'da-DK' },
		{ name: 'German (Austria)', value: 'de-AT' },
		{ name: 'German (Switzerland)', value: 'de-CH' },
		{ name: 'German (Germany)', value: 'de-DE' },
		{ name: 'Greek', value: 'el-GR' },
		{ name: 'English (Australia)', value: 'en-AU' },
		{ name: 'English (Canada)', value: 'en-CA' },
		{ name: 'English (United Kingdom)', value: 'en-GB' },
		{ name: 'English (Ireland)', value: 'en-IE' },
		{ name: 'English (New Zealand)', value: 'en-NZ' },
		{ name: 'English (United States)', value: 'en-US' },
		{ name: 'Esperanto', value: 'eo-EO' },
		{ name: 'Spanish (Spain)', value: 'es-ES' },
		{ name: 'Spanish (Mexico)', value: 'es-MX' },
		{ name: 'Estonian', value: 'et-EE' },
		{ name: 'Basque', value: 'eu-ES' },
		{ name: 'Persian', value: 'fa-IR' },
		{ name: 'Finnish', value: 'fi-FI' },
		{ name: 'French (Canada)', value: 'fr-CA' },
		{ name: 'French (France)', value: 'fr-FR' },
		{ name: 'Irish', value: 'ga-IE' },
		{ name: 'Scottish Gaelic', value: 'gd-GB' },
		{ name: 'Galician', value: 'gl-ES' },
		{ name: 'Hebrew', value: 'he-IL' },
		{ name: 'Hindi', value: 'hi-IN' },
		{ name: 'Croatian', value: 'hr-HR' },
		{ name: 'Hungarian', value: 'hu-HU' },
		{ name: 'Indonesian', value: 'id-ID' },
		{ name: 'Italian', value: 'it-IT' },
		{ name: 'Japanese', value: 'ja-JP' },
		{ name: 'Georgian', value: 'ka-GE' },
		{ name: 'Kazakh', value: 'kk-KZ' },
		{ name: 'Kannada', value: 'kn-IN' },
		{ name: 'Korean', value: 'ko-KR' },
		{ name: 'Kyrgyz', value: 'ky-KG' },
		{ name: 'Lithuanian', value: 'lt-LT' },
		{ name: 'Latvian', value: 'lv-LV' },
		{ name: 'Malayalam', value: 'ml-IN' },
		{ name: 'Marathi', value: 'mr-IN' },
		{ name: 'Malay', value: 'ms-MY' },
		{ name: 'Malay (Singapore)', value: 'ms-SG' },
		{ name: 'Norwegian Bokmål', value: 'nb-NO' },
		{ name: 'Dutch (Belgium)', value: 'nl-BE' },
		{ name: 'Dutch (Netherlands)', value: 'nl-NL' },
		{ name: 'Norwegian', value: 'no-NO' },
		{ name: 'Punjabi', value: 'pa-IN' },
		{ name: 'Polish', value: 'pl-PL' },
		{ name: 'Portuguese (Brazil)', value: 'pt-BR' },
		{ name: 'Portuguese (Portugal)', value: 'pt-PT' },
		{ name: 'Romanian', value: 'ro-RO' },
		{ name: 'Russian', value: 'ru-RU' },
		{ name: 'Sinhala', value: 'si-LK' },
		{ name: 'Slovak', value: 'sk-SK' },
		{ name: 'Slovenian', value: 'sl-SI' },
		{ name: 'Albanian', value: 'sq-AL' },
		{ name: 'Serbian', value: 'sr-RS' },
		{ name: 'Swedish', value: 'sv-SE' },
		{ name: 'Tamil', value: 'ta-IN' },
		{ name: 'Telugu', value: 'te-IN' },
		{ name: 'Thai', value: 'th-TH' },
		{ name: 'Tagalog', value: 'tl-PH' },
		{ name: 'Turkish', value: 'tr-TR' },
		{ name: 'Ukrainian', value: 'uk-UA' },
		{ name: 'Vietnamese', value: 'vi-VN' },
		{ name: 'Chinese (China)', value: 'zh-CN' },
		{ name: 'Chinese (Hong Kong)', value: 'zh-HK' },
		{ name: 'Chinese (Singapore)', value: 'zh-SG' },
		{ name: 'Chinese (Taiwan)', value: 'zh-TW' },
		{ name: 'Zulu (South Africa)', value: 'zu-ZA' }
	];
	let Words: string;

	const unsubscribe = settings.subscribe((e) => {
		if (e) {
			Words = e.keywords.join(', ');
		}
	});

	onDestroy(unsubscribe);
</script>

<main class="w-full flex justify-center h-screen overflow-auto">
	<a href="/" class="btn fixed top-5 left-5">Zurück</a>
	<div class="w-3/5 bg-base-200 h-fit min-h-full p-5">
		<h1 class="text-4xl flex place-content-center w-full">Settings</h1>

		<div>
			{#if $settings && $settings.keywords}
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text text-xl">Wähle deine Sprache aus</span>
					</div>
					<select class="select select-bordered text-lg" bind:value={$settings.language}>
						{#each languageNames as names}
							<option value={names.value} selected={names.value === $settings.language}
								>{names.name}</option
							>
						{/each}
					</select>
				</label>

				<label class="form-control">
					<div class="label">
						<span class="label-text">Schlüsselwörter</span>
					</div>
					<textarea
						class="textarea textarea-bordered h-28 w-full max-w-xs max-h-80"
						placeholder="Mit Komma trennen"
						bind:value={Words}
						on:change={() => {
							settings.update((e) => {
								e.keywords = Words.replace(/\s/g, '').split(',');
								return e;
							});
							save();
						}}
					/>
				</label>
			{/if}
		</div>
	</div>
</main>
