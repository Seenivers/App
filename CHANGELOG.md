# [0.18.0](https://github.com/Seenivers/App/compare/v0.17.0...v0.18.0) (2025-01-13)


### Bug Fixes

* add write permissions for content in the release workflow ([37328cb](https://github.com/Seenivers/App/commit/37328cb79d5d6f029333615ea53582d9fe42ed03))
* **layout:** prevent context menu in production environment ([7293861](https://github.com/Seenivers/App/commit/72938610b7b2b1f07e3cb9279480286798d47aee))
* **macOS:** add `signingIdentity` to Tauri config for self-signing ([1fedd00](https://github.com/Seenivers/App/commit/1fedd00444b54d8d668fbf3309b16ee410fa6d07))
* update Renovate schedule to run before 5 a.m. and set timezone to Europe/Berlin ([bcfc28d](https://github.com/Seenivers/App/commit/bcfc28de924f6730dbfb9ed39f90f1bb2ddada9a))


### Features

* add error handling and actor details localization in German and English ([c8fb6c8](https://github.com/Seenivers/App/commit/c8fb6c803e057b45457dd3ed433f548d06f4eaca))
* add network status localization in German ([4c945af](https://github.com/Seenivers/App/commit/4c945af368921d41abd3f02032880b54dc43dd05))
* add network status messages and enhance add page localization in English ([486d332](https://github.com/Seenivers/App/commit/486d3321dbb24984ec901c7408429521caa52cec))
* add support for German, French, and Spanish translations ([c17492c](https://github.com/Seenivers/App/commit/c17492c2d0253f230926148948c46144ab1e858e))
* **dependencies:** add svelte-i18n for internationalization support ([bf7fe35](https://github.com/Seenivers/App/commit/bf7fe355cc3d2840d9cd8bff94c625670498f57a))
* **docs:** add Crowdin badge to README ([06372b2](https://github.com/Seenivers/App/commit/06372b2f1ff3cbf83311ef7f2a3f8652cd990332))
* enhance German localization for add page and modal components ([74856ec](https://github.com/Seenivers/App/commit/74856ecadc26879a422131d211ce1352c40e0771))
* **i18n:** add internationalization support for title in the main page ([82eef02](https://github.com/Seenivers/App/commit/82eef02ad70a500f8e7a49f68dfc7358082a3201))
* **i18n:** configure i18n-ally settings for locale paths and key style ([58b4c8f](https://github.com/Seenivers/App/commit/58b4c8f1126e5dca3a8e4953fbee34cc436133fd))
* **i18n:** extended German translations for navigation and loading displays ([5f9a448](https://github.com/Seenivers/App/commit/5f9a448d2751f939831c49cb51a14c7db195ca5c))
* **i18n:** extended German translations for search filters and loading displays ([e88eb7b](https://github.com/Seenivers/App/commit/e88eb7b3867e5015fb4b81d003f1ecf5755a0106))
* **i18n:** implement internationalization with German locale support ([cc94b73](https://github.com/Seenivers/App/commit/cc94b738a82bbc8e3d9ef73426d0f5683fc5fb0e))
* implement localization for navigation buttons in German ([bb2b1f0](https://github.com/Seenivers/App/commit/bb2b1f0bc8ee330e8655af298cabe1e1fb5e63c9))
* **movie:** display YouTube trailers when available ([3105b66](https://github.com/Seenivers/App/commit/3105b666e88218b8281647452fd9eae29c75ebe8))
* update i18n-ally settings for improved localization management ([8625cf5](https://github.com/Seenivers/App/commit/8625cf54d67ea2c05cdd2304d012da4739566113))
* **workflow:** add code formatting job to release workflow ([76a5e37](https://github.com/Seenivers/App/commit/76a5e37f376716ba543053004b6ef83796afecfc))

# [0.17.0](https://github.com/Seenivers/App/compare/v0.16.1...v0.17.0) (2025-01-07)


### Bug Fixes

* **docs:** update GitHub License badge link in README.md ([1543250](https://github.com/Seenivers/App/commit/15432505e06246460ab236a320a2e7c480ae7786))
* enable updaterJsonPreferNsis in release workflow for improved installer handling ([265b1d2](https://github.com/Seenivers/App/commit/265b1d27d75d05aa49422d894a3864da11145a1c))
* **renovate:** remove unnecessary npm label from automerge configuration ([fba2583](https://github.com/Seenivers/App/commit/fba2583fcf25acbdeea60badb939f1484d5f8dae))
* **tsconfig:** add vidstack types for improved type checking in Svelte ([76ac22b](https://github.com/Seenivers/App/commit/76ac22b3b1d35a610ded3d67c8d62f03a242eca0))
* update migration file path handling to use join for better compatibility ([783a10d](https://github.com/Seenivers/App/commit/783a10d56232928da3b2df430b9d1ab446458dcb))
* update targets in tauri configuration to 'all' for broader compatibility ([398652e](https://github.com/Seenivers/App/commit/398652e58c903986ce6fe71b5ddaf83202ea97fd))


### Features

* add SECURITY.md to outline security policy and reporting procedures ([72685fb](https://github.com/Seenivers/App/commit/72685fb6d5e0ae7dd83906e4706b64235d41e616))
* add vidstack dependency for enhanced video handling ([706d62b](https://github.com/Seenivers/App/commit/706d62b06b0c862d529119bf4adf242add568fcd))
* **csp:** add media-src directive to tauri configuration ([f83f9b9](https://github.com/Seenivers/App/commit/f83f9b9d3187e6b456304115218b6bfd7415b99d))
* **dependencies:** add hls.js version 1.5.18 to package.json and pnpm-lock.yaml ([6100b73](https://github.com/Seenivers/App/commit/6100b732f7fd88072057806b9567047e96423fa5))
* **dependencies:** update schedule to run on Sundays and Saturdays for better automation ([7b76591](https://github.com/Seenivers/App/commit/7b76591a385103fa2f659dfa87f3aa174d33affd))
* **i18n:** add Vidstack URL for documentation reference ([1f48bac](https://github.com/Seenivers/App/commit/1f48baceff75ea8b0248cb7698d1e7263e1f7102))
* implement Vidstack player component for video playback and tracking ([8935775](https://github.com/Seenivers/App/commit/89357753af2e30baff3a898c70e846c3fd6a8651))
* **movie:** display genres as badges for improved visual clarity ([cdcd4f5](https://github.com/Seenivers/App/commit/cdcd4f5f25f385ac815897feea8f34dba879c6c4))
* **movie:** enhance movie details display with additional information ([289aaf4](https://github.com/Seenivers/App/commit/289aaf4de97941d0b91e1eaaae7bdbefe1f789b8))
* **movie:** improve movie details layout and format monetary values ([e687192](https://github.com/Seenivers/App/commit/e68719292ee3d8756d0ee12c08e4794984849487))
* **movie:** remove homepage section for cleaner movie details display ([6e9847b](https://github.com/Seenivers/App/commit/6e9847bc349230526bb9c78a30fea41e4356f4f0))
* **movie:** remove unnecessary text-base class for improved layout consistency ([5783013](https://github.com/Seenivers/App/commit/5783013ebb8d7c1d5388d0197ab55d9b94c7eb55))
* **readme:** add GitHub badges for stars, forks, issues, contributors, downloads, and latest release ([77715b6](https://github.com/Seenivers/App/commit/77715b61b801ba081988b07a24dcea1b3893f3ff))
* **renovate:** add 'dependencies' label to update configurations for better categorization ([994dc4a](https://github.com/Seenivers/App/commit/994dc4ab58e5dd3d7e3b4973145d612ad4789ed2))
* **renovate:** add automergeSchedule for improved dependency management ([af54132](https://github.com/Seenivers/App/commit/af54132328919068f42e80d6409ad3a72633309e))
* **renovate:** update schedule and automergeSchedule to run on weekends during early hours ([f43b49b](https://github.com/Seenivers/App/commit/f43b49b055e8b4d5abf7e17301354b0fd00f4514))
* **search:** implement session storage for search criteria management ([960b887](https://github.com/Seenivers/App/commit/960b88769a16b0f7ba93a7b5bcbc493db4054f35))
* **settings:** add 'Trailer' option to default keywords ([8cb4b24](https://github.com/Seenivers/App/commit/8cb4b24330f91d2a886a7743a6cda1703f414db5))
* **types:** replace string types with ISO3166_1 and ISO639_1 for better type safety ([5503e93](https://github.com/Seenivers/App/commit/5503e937eb598c43773bfbbc6afc4b58461b8956))
* **Vidstack:** save component state on destroy ([1c19ad7](https://github.com/Seenivers/App/commit/1c19ad7b9deadc75cf984beecc3a1957352d0134))
* **vite:** add vidstack plugin for enhanced video capabilities ([f6d6320](https://github.com/Seenivers/App/commit/f6d6320f09a45540b4a0388aa1b828a35e5db688))
* **vscode:** add custom HTML data for vidstack in settings ([437d8a6](https://github.com/Seenivers/App/commit/437d8a607000c5760df289a2f9e5afedb7555bbb))
* **workflow:** add code formatting workflow using Prettier for consistent style ([6e2314a](https://github.com/Seenivers/App/commit/6e2314a931143bc2648ff623e2b513b27fe8d838))
* **workflow:** update format workflow to include write permissions and simplify push command ([eabf548](https://github.com/Seenivers/App/commit/eabf548d65941b9461dad3e7c4ccf6246b1cef7b))
* **workflow:** update Node.js setup to use latest LTS version for improved compatibility ([2b4d82a](https://github.com/Seenivers/App/commit/2b4d82a2d2df2b5bf625a3284cab39a34178d011))

## [0.16.1](https://github.com/Seenivers/App/compare/v0.16.0...v0.16.1) (2024-12-30)

### Bug Fixes

- **deps:** remove unnecessary devtools feature from tauri dependency ([c0dc5e9](https://github.com/Seenivers/App/commit/c0dc5e9ddedf880330fcc494fb51bc3bd4ebf394))

# [0.16.0](https://github.com/Seenivers/App/compare/v0.15.0...v0.16.0) (2024-12-30)

### Bug Fixes

- add type annotation to drizzle configuration ([42c6300](https://github.com/Seenivers/App/commit/42c6300b32b2826e75b22125154cbbdb4c8bda63))
- **dependabot:** change package ecosystem from pnpm to npm ([3ed2e38](https://github.com/Seenivers/App/commit/3ed2e383204c7f48ea87fbbf0da0f187773b8955))
- **deps:** update dependency drizzle-orm to ^0.38.2 ([4b0bc42](https://github.com/Seenivers/App/commit/4b0bc427a6865f1881da02109a2e62067281b966))
- improve error handling for image dimension fetching and downloading ([5a208b7](https://github.com/Seenivers/App/commit/5a208b782a41f12289ddfc6f93a26f4340ebbbdc))
- integrate tauri-plugin-opener and update main function to use seenivers_lib ([89ca289](https://github.com/Seenivers/App/commit/89ca2890f009992c864951466a6504a2207dbb49))
- **movie:** ensure collection display only when path is available ([621c144](https://github.com/Seenivers/App/commit/621c14436f017280c7e07c5deafab45f5821929d))
- **player:** update event listener to 'loadedmetadata' and correct currentTime assignment ([a56b2ca](https://github.com/Seenivers/App/commit/a56b2cafb2ac5be571c2b6994fa89dee1f9f4419))
- update default.json to enhance main window capabilities and add opener and process permissions ([47923b6](https://github.com/Seenivers/App/commit/47923b6ab741b839be1c3d6f6b4254f3a7f606bb))
- update dependabot configuration to use pnpm as the package ecosystem ([16ff862](https://github.com/Seenivers/App/commit/16ff8626792e9e9637b10d3c29c41523d5a87891))
- update documentation links and improve type assertion in configuration files ([d2cb9ef](https://github.com/Seenivers/App/commit/d2cb9efac53f9f0f8302339ff016103e7426e5d9))
- update GitHub Actions workflow to use pnpm for dependency management and installation ([11fb87a](https://github.com/Seenivers/App/commit/11fb87a2dd8c41bd00f2290725ee71bfdc55d869))
- update package name and library name for consistency; add tauri-plugin-opener dependency ([5a2cc86](https://github.com/Seenivers/App/commit/5a2cc86d1427acd55a46436b60bba23b2f16638e))
- update renovate configuration to use pnpm and adjust package rules ([878d080](https://github.com/Seenivers/App/commit/878d080a19db06807dd2046824113b19b7fa5958))
- update tauri configuration for consistent identifier and switch to pnpm commands ([b347beb](https://github.com/Seenivers/App/commit/b347bebae313ecf0b6b2e43e0358aea21566cc89))
- update VSCode settings to ignore pnpm-lock.yaml instead of package-lock.json ([2d90e27](https://github.com/Seenivers/App/commit/2d90e27a7ed82e930b1090918c7a182bbb01da0b))
- use nullish coalescing operator for error message in image download ([21ba866](https://github.com/Seenivers/App/commit/21ba866c53e0f9e6eb755953dcbc7cdf7140ba93))

### Features

- add Android configuration for Tauri application ([5472ed8](https://github.com/Seenivers/App/commit/5472ed824f64e65d9181ac9c6b7f7d86cbcd0e97))
- add conditional updater plugin for desktop platforms ([94b3d10](https://github.com/Seenivers/App/commit/94b3d109c39c8cff208bcca5d0db03462a391db7))
- add iOS configuration for Tauri application ([937a60f](https://github.com/Seenivers/App/commit/937a60f481b7148a5ca2e929f66b0971066af78c))
- add Linux configuration for Tauri application ([5b4aa7f](https://github.com/Seenivers/App/commit/5b4aa7f967d76a94fd77bfda3353fa4f1f09c841))
- add macOS configuration for Tauri application ([3a501db](https://github.com/Seenivers/App/commit/3a501db71fdc5ecf97d6e9c8e85827dac03cfce9))
- add SVG icons for Plyr player and update iconUrl in Plyr.svelte ([0666aed](https://github.com/Seenivers/App/commit/0666aed265d9f1d0fb6e3289576663b9dc8a57ce))
- add Windows configuration for Tauri application ([1ce3033](https://github.com/Seenivers/App/commit/1ce303346ce331563b39fdead3611793c36d1cc8))
- **i18n:** add URL for Plyr internationalization documentation ([12540ef](https://github.com/Seenivers/App/commit/12540ef19e268cd964f88c0695db728cf078424b))
- integrate Plyr for enhanced video playback controls and state management ([85d1b43](https://github.com/Seenivers/App/commit/85d1b43196174cae3b14a48c7f9049a97eafa548))

# [0.15.0](https://github.com/Seenivers/App/compare/v0.14.0...v0.15.0) (2024-12-22)

### Bug Fixes

- **add-page:** correct movie search logic to trigger only when ID is missing ([11e2b90](https://github.com/Seenivers/App/commit/11e2b90ef507fb94babea0bfcef5c739d0f300f8))
- **add-page:** correct movie status assignment logic based on user selection ([18de5d8](https://github.com/Seenivers/App/commit/18de5d83a6785a917436a62fdabe29a0416549a4))
- **add-page:** enhance error logging and validate movie search status before proceeding ([73b8998](https://github.com/Seenivers/App/commit/73b8998f265b317916938d2879aae56284090800))
- adjust video player controls timeout and update onDestroy behavior ([5f86048](https://github.com/Seenivers/App/commit/5f86048df277b1e3f6e5eecad425aec3ba2bbb2d))
- change 'status' to const as it is never reassigned ([91f3c1f](https://github.com/Seenivers/App/commit/91f3c1f8c39f83a82f2b7b433d543b4c9317d333))
- **collection:** ensure browser-only operation and improve error handling for collection loading ([303ab9c](https://github.com/Seenivers/App/commit/303ab9c371cacd9baabe3e02775efbb4ee8ff2bc))
- **data-fetch:** ensure fetch always makes a request and handles DB content as JSON ([a87bd75](https://github.com/Seenivers/App/commit/a87bd75de67b03f485dfb3bb964b7a95632a3219))
- **deps:** update dependency @tauri-apps/plugin-sql to ^2.2.0 ([7168364](https://github.com/Seenivers/App/commit/71683649418ed735607e302dc6f0f166f2244c59))
- **deps:** update dependency drizzle-orm to ^0.38.1 ([3d21ce6](https://github.com/Seenivers/App/commit/3d21ce620e2877c1783a4927b59d2508ecf6c8a1))
- **download:** ensure online status is checked before processing download queue ([4ab85e0](https://github.com/Seenivers/App/commit/4ab85e02cf565f4eea02ad5de595d99bdbf3599d))
- **error page:** replace link with button for improved navigation handling ([792bd77](https://github.com/Seenivers/App/commit/792bd77b510685a6fedde9cd4e262db48cd89ec1))
- **error page:** update import from '$app/stores' to '$app/state' for correct state management ([e3e719e](https://github.com/Seenivers/App/commit/e3e719e63519990e2f8815feb426c34648f5a0d7))
- **filter:** adjust movie filtering logic and improve UI feedback for no results ([419ff37](https://github.com/Seenivers/App/commit/419ff37e2c98def838aa798e4e47bd2446fd8bab))
- **imports:** update settings import path to '$lib/db/funktion' ([8b282f5](https://github.com/Seenivers/App/commit/8b282f5a43cfd96844616734548993eb3e29010f))
- **migrations:** resolve type error for ArrayBuffer conversion and improve error handling ([d21198b](https://github.com/Seenivers/App/commit/d21198b7113c5677e92e5b994b14f15e9ae90ede))
- **movie:** improve error handling and fetch movie data from TMDB if not found locally ([6d2429a](https://github.com/Seenivers/App/commit/6d2429a0dd893e9e599f2c913c6f253a2595276f))
- **movie:** remove unused file system import in movie page load function ([e4b87f9](https://github.com/Seenivers/App/commit/e4b87f9c044ff7ee0ebf46fe4a96369a29635215))
- **openModal:** add validation to ensure modal is only opened for valid film states ([d149ce0](https://github.com/Seenivers/App/commit/d149ce0fdce43a836b76e60a6dca2defabf89bfd))
- resolve dependency conflict by upgrading vite version to ^6.0.3 ([5418dc9](https://github.com/Seenivers/App/commit/5418dc9898ac9284ba87862cf1d670592cefc579))
- **selectMovie:** add validation to prevent invalid movie selection and handle errors ([8e5c073](https://github.com/Seenivers/App/commit/8e5c07371cda0087655c15183e6d43687aad24b4))

### Features

- **actor schema:** simplify actor schema by removing unused fields and adding TMDB reference ([4755b23](https://github.com/Seenivers/App/commit/4755b2344ea92b629d63d5dc333d8f3847efe8c3))
- **actor types:** add Actor interface and related types for improved type safety ([49d78c6](https://github.com/Seenivers/App/commit/49d78c678e1a3a8ef98f4ef6fa475ffdd8856329))
- **actor types:** update Actor interface to include Gender type and nullable fields ([90aa289](https://github.com/Seenivers/App/commit/90aa289f557d735cf0606507852e5eae7174f3dc))
- **actor:** add functions to get, add, and retrieve all actors from the database ([a52950c](https://github.com/Seenivers/App/commit/a52950c44eded3d214677ea1e0937fd3b8ff0402))
- **actor:** add getActor function to fetch actor data by ID ([98aa5a1](https://github.com/Seenivers/App/commit/98aa5a1b284b863602d1be98366c1196a82987fe))
- **actor:** implement actor detail page with data fetching and display ([66d4388](https://github.com/Seenivers/App/commit/66d4388e631ab61034878d0d07e4f6e4e08c3b77))
- add back button functionality to Navbar component for improved navigation ([6cbcb7b](https://github.com/Seenivers/App/commit/6cbcb7b63f2c6e4a58215d9248662b9eab4c3f42))
- add Img component for optimized image handling across multiple pages ([53fe9fb](https://github.com/Seenivers/App/commit/53fe9fb3e0dae2691d89630dd9b294ec27fff9c7))
- add reusable Navbar component with customizable slots for left, middle, and right sections ([d8e55ff](https://github.com/Seenivers/App/commit/d8e55ff8920235d6f49e145cd7fa233857a90b65))
- **collection:** add preload data attribute for movie links to enhance navigation performance ([2900c63](https://github.com/Seenivers/App/commit/2900c63da484425c98785f5b655237ad32eb7cd3))
- **collection:** add toggle button for grid/list view in Navbar ([5f5db32](https://github.com/Seenivers/App/commit/5f5db32d104c6195477dd6d206531e103265b0ff))
- **collection:** remove unused file system import from collection page ([3f8df68](https://github.com/Seenivers/App/commit/3f8df681760cdb624676332195850d7d40bd0a73))
- **database:** refactor getDb function to remove async and improve initialization ([08607c9](https://github.com/Seenivers/App/commit/08607c9ac769d5ebf6552e9156c7da2343054991))
- **db:** change loadedSettings to a local variable in funktion.ts ([c899bad](https://github.com/Seenivers/App/commit/c899bad93bf4a8233f592f9a25dd2cc3f5e308f0))
- **db:** optimize updateEntity function to streamline entity updates and improve error handling ([091d423](https://github.com/Seenivers/App/commit/091d42372c45a949b6103919e085677066051dd7))
- **db:** remove loadedSettings import and use settings.language in updateOldDB function ([9a3954d](https://github.com/Seenivers/App/commit/9a3954d5976210f722b18ad13de12d6a8cb18b60))
- **dependencies:** expand features for tauri-plugin-http to enhance functionality ([1036bde](https://github.com/Seenivers/App/commit/1036bde41c7f8dbb97227b484e1588550ed100dd))
- **docs:** add developer documentation for Svelte CLI with usage instructions and options ([62ea561](https://github.com/Seenivers/App/commit/62ea5615fb2d81343ce0bab72ad603cbc25e7504))
- **load-utils:** extract ID parsing logic into a separate utility function ([4938ce1](https://github.com/Seenivers/App/commit/4938ce13bb74250e5bc4c74de51e019c3be6ade8))
- **migrations:** add migration for restructuring actors, collections, and movies tables with unique indexes ([8e74f4f](https://github.com/Seenivers/App/commit/8e74f4fffd73ef564d1ed3e00a4c1993bfdcc2f2))
- **movie page:** implement data loading in separate load function and initialize matchedMovies with page data ([70dec5a](https://github.com/Seenivers/App/commit/70dec5a9da19cb5232077b2cdc13c173674502f9))
- **movie:** add link to TMDB for movie details and improve button visibility based on data availability ([18f914c](https://github.com/Seenivers/App/commit/18f914cc4c67582d60b8b930bd6298fcb4f88601))
- **movie:** replace cast button with link to actor detail page for improved navigation ([79bd56e](https://github.com/Seenivers/App/commit/79bd56e02f2e2912eed95a18ab7b6d70fed6856d))
- replace inline Navbar implementation with reusable Navbar component across multiple pages ([ff083c3](https://github.com/Seenivers/App/commit/ff083c3657d99748cbe85974f56a13680433bc7b))
- **types/add.ts:** add optional id field to SearchOptions interface ([5d8e89f](https://github.com/Seenivers/App/commit/5d8e89f9c787717dbf94b0a97369317cca664b7b))
- **types:** export Cast and Crew interfaces for improved accessibility ([0dce2d4](https://github.com/Seenivers/App/commit/0dce2d455c2935649f23cacd6a1a030a3d803092))
- **ui:** reset filter when clearing all movies ([37b23a4](https://github.com/Seenivers/App/commit/37b23a4caa5b3ab707b50c3e371ad1e3cec474ab))
- **update:** extend update functions to include actors and process actor data ([2a0267c](https://github.com/Seenivers/App/commit/2a0267c1e9dd997760a839e6db20e3f810f989cf))
- **update:** implement functions to update movies and collections, and migrate old database entries ([3283baa](https://github.com/Seenivers/App/commit/3283baa3da2a2ceb8d3ade5a1bdc414068b4f44c))
- **update:** include updateActors function in the update process and optimize actor image loading ([db71f61](https://github.com/Seenivers/App/commit/db71f61fd71f71a63d781a400272bc57951ff182))

# [0.14.0](https://github.com/Seenivers/App/compare/v0.13.0...v0.14.0) (2024-12-12)

### Bug Fixes

- **add-files:** replace logical OR with nullish coalescing operator ([4b1f438](https://github.com/Seenivers/App/commit/4b1f43819364157ec4f896d37b4ce7255e18c63a))
- **add-files:** use `RegExp.exec` for extracting year from file name ([3b6e0a1](https://github.com/Seenivers/App/commit/3b6e0a11ab524b72b00a567eec7f9ecb0154cb40))
- **add:** validate path parameter in addNewMovie function ([fbaba58](https://github.com/Seenivers/App/commit/fbaba58d2b6d0c66eae040fd62ac60eb55a1d221))
- **collection:** handle missing release date gracefully ([f66d4e2](https://github.com/Seenivers/App/commit/f66d4e27e9b598d8b252193bc5a1bff8bd961461))
- **deps:** update dependency @tauri-apps/plugin-dialog to ^2.2.0 ([384d3f3](https://github.com/Seenivers/App/commit/384d3f3c92dfc9b817d46e1b61baedd0dd7ad6d9))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.2.0 ([f806b1b](https://github.com/Seenivers/App/commit/f806b1bce694e225a5c91a145cd03367d360f35e))
- **deps:** update dependency @tauri-apps/plugin-http to ^2.2.0 ([96ce18e](https://github.com/Seenivers/App/commit/96ce18e3e230ebcd716c11b95c22c4aa6c66e906))
- **deps:** update dependency @tauri-apps/plugin-log to ^2.2.0 ([e60ff70](https://github.com/Seenivers/App/commit/e60ff7038c05d9a85ac1033a42bc67b851775a19))
- **deps:** update dependency @tauri-apps/plugin-process to ^2.2.0 ([c2b7bb4](https://github.com/Seenivers/App/commit/c2b7bb493e94297d15e6562a47830d614e013260))
- **deps:** update dependency @tauri-apps/plugin-shell to ^2.2.0 ([dd48e35](https://github.com/Seenivers/App/commit/dd48e357e14c97512a29033c7a3afaa56c1e5eaa))
- **deps:** update dependency @tauri-apps/plugin-updater to ^2.3.0 ([a7a1b6e](https://github.com/Seenivers/App/commit/a7a1b6e711d9fea19c6ab99a59436e30f64a7c3d))
- **deps:** update rust crate serde to 1.0.216 ([11db995](https://github.com/Seenivers/App/commit/11db995c64ac52b3ea98de67a317db7fcae86063))
- **deps:** update rust crate tauri-plugin-dialog to 2.2.0 ([70e3e9f](https://github.com/Seenivers/App/commit/70e3e9f292937674ef48e9a47d4be666ca365886))
- **deps:** update rust crate tauri-plugin-fs to 2.2.0 ([5ad1a39](https://github.com/Seenivers/App/commit/5ad1a39d719906bbc7ef78923c1cdd88ea64f145))
- **deps:** update rust crate tauri-plugin-http to 2.2.0 ([38fe03b](https://github.com/Seenivers/App/commit/38fe03b17a0a6bcf7fa80a12ad86a234bb23bac3))
- **deps:** update rust crate tauri-plugin-log to 2.2.0 ([61f6767](https://github.com/Seenivers/App/commit/61f6767820b8d5fdb3f9744418466adf1f241c81))
- **deps:** update rust crate tauri-plugin-process to 2.2.0 ([6efea91](https://github.com/Seenivers/App/commit/6efea918c0efe54826367445936fbe8d3a561071))
- **deps:** update rust crate tauri-plugin-shell to 2.2.0 ([da3c405](https://github.com/Seenivers/App/commit/da3c4059cd4379d513fbefba73fcf32e6a3fa091))
- **deps:** update rust crate tauri-plugin-sql to 2.2.0 ([65cacca](https://github.com/Seenivers/App/commit/65caccab98f65ca2311ca7a3f3f3bf76601aa36e))
- **deps:** update rust crate tauri-plugin-updater to 2.3.0 ([c1a7489](https://github.com/Seenivers/App/commit/c1a7489cadc91261d137057a1ba54a359f1b448f))
- **dnd-component:** refactor and improve drag-and-drop functionality ([b48a4c0](https://github.com/Seenivers/App/commit/b48a4c0f473556fc4edac9de463894e9326065c2))
- **dnd:** correctly handle files and directories by checking extensions before directory reading ([fc5bbbd](https://github.com/Seenivers/App/commit/fc5bbbdef244259041dfb2b246ffcae71534f8fb))
- **dnd:** ensure event listeners are cleaned up correctly ([1c7477c](https://github.com/Seenivers/App/commit/1c7477cdfe50581c8acf7c4907d03735a4bc8860))
- **drag-drop:** fix file path handling for directory entries ([e1cafba](https://github.com/Seenivers/App/commit/e1cafba5c9e98fd5c24ecd9046afa45c32566514))
- ensure SQLite is loaded before initializing dbInstance ([edf15b2](https://github.com/Seenivers/App/commit/edf15b204b56a1a01dddf4834956d430584f5a04))
- **fetchImageDimensions:** remove unnecessary console.log statement ([f19d847](https://github.com/Seenivers/App/commit/f19d8475f953704a4c1886491db4a2d70d716dd4))
- **icon:** swap icons for 'notStarted' and 'searching' states ([88f4ccc](https://github.com/Seenivers/App/commit/88f4ccc915b1b2301619a5cc1062b45072770b5f))
- **image:** improve image handling logic for offline and download scenarios ([739eff9](https://github.com/Seenivers/App/commit/739eff9d12d29e970c8ce854f3163f361d8e90a7))
- **image:** use `join` for path construction in `image` function ([ea45bde](https://github.com/Seenivers/App/commit/ea45bde1ce06fa4b68cd7e6129fb29bd54a590b1))
- **layout:** improve readability of "not started" message ([34c46c6](https://github.com/Seenivers/App/commit/34c46c6f703266b8f9a993d2822c377791992da0))
- **modal movie selection:** make selectMovie function async and update button to await selection ([478d16b](https://github.com/Seenivers/App/commit/478d16bfaf5fce4d8fc925a311db5385b7986087))
- **modal:** prevent opening modal for downloading or already found films ([ee37fc0](https://github.com/Seenivers/App/commit/ee37fc0a96cedb8f39ce6fef2aba0c1a5fd8a135))
- **movie:** ensure all actor images are loaded regardless of castImages setting ([5ebcb7b](https://github.com/Seenivers/App/commit/5ebcb7b674ec0accf4771aff128b018ea8c87f42))
- **movie:** ensure collection uniqueness check before adding to database ([910b2e6](https://github.com/Seenivers/App/commit/910b2e60386b2ec2d97a950d68669258bc727512))
- **navbar:** improve condition for clearing results on leave ([7bb4ca6](https://github.com/Seenivers/App/commit/7bb4ca6ef94a7bdeca06a34660593d456e3fa8ad))
- **navbar:** improve navigation logic, disable buttons based on conditions, and adjust tooltip visibility ([ac98184](https://github.com/Seenivers/App/commit/ac98184722eee6e4aafc0fb5a2f12b784adcc4b1))
- **navbar:** replace "Hinzufügen" button with "Zurück" button for better navigation ([c1c59fc](https://github.com/Seenivers/App/commit/c1c59fcd7c9c136261d57763847571af5ee30a76))
- **navbar:** reset filter state when navigating back to homepage ([b34fe34](https://github.com/Seenivers/App/commit/b34fe343b6b08cd8d62215e9d30b5f082e22d996))
- **online-status:** initialize `isOnline` store with current navigator.onLine status ([e20fdb5](https://github.com/Seenivers/App/commit/e20fdb585bfc76415785e57050fd39ce36d494a4))
- optimize regex to prevent super-linear runtime in file name cleaning ([ee24922](https://github.com/Seenivers/App/commit/ee24922bc52210bcbe216aaeeccccbcdc7c4c192))
- refactor function to reduce Cognitive Complexity. ([29c403e](https://github.com/Seenivers/App/commit/29c403e1b508015ac4dcbcc382284f29184fd340))
- **regex:** optimize regex to prevent super-linear runtime and DoS vulnerability ([5ea7fa2](https://github.com/Seenivers/App/commit/5ea7fa2fe174d9b2b98902750b317eba7dc7af87))
- remove unused import of 'debug' ([9c2726c](https://github.com/Seenivers/App/commit/9c2726c4bd24acd327ba37ff05033035df53f496))
- **search:** add status check and ensure correct state transitions ([9cb311e](https://github.com/Seenivers/App/commit/9cb311e617137d4e811d510b7ca6489801273143))
- **search:** move internet connection check before search status check ([dbcce99](https://github.com/Seenivers/App/commit/dbcce994237bbc71fb9fc695405cb870ac5d01fd))
- **searchMovieStatus:** correct state update order before adding new movie ([154f7f5](https://github.com/Seenivers/App/commit/154f7f562a52e0071bee2fdb3c13936af9258a85))
- **search:** prevent infinite loop by adding check for results length ([009ed2c](https://github.com/Seenivers/App/commit/009ed2c2d184bdf99e8eab51e3a1a40ac08e3841))
- **search:** prevent search input from disappearing when typing ([70d4ec7](https://github.com/Seenivers/App/commit/70d4ec7a06f29d5298ed12842f67727ba800eeff))
- **search:** update movie status after manual selection in modal ([77a9850](https://github.com/Seenivers/App/commit/77a9850626b8134852d247fcca5dc37c25479dec))
- **select:** disable select when offline or status is empty ([8b528e3](https://github.com/Seenivers/App/commit/8b528e30b150cb7c382e0bebf61cd61af81b9f7a))
- **settings:** store only language code (e.g., 'de', 'en') without region part ([fcf00bd](https://github.com/Seenivers/App/commit/fcf00bdf8ab22a1ce76a1c6867737a425d86ca8b))
- **types:** explicitly define function parameters and return types in `searchMovieStatus` ([9bb5afd](https://github.com/Seenivers/App/commit/9bb5afd500b27d216a3df55d4a46acf2802323ac))
- **types:** prefer nullish coalescing over logical OR ([00af689](https://github.com/Seenivers/App/commit/00af68905800688bb3aa55e8b08de8f462c01fd1))
- **ui:** add gap classes to navbar div elements for improved spacing ([41daf1a](https://github.com/Seenivers/App/commit/41daf1a676eec769fe8a0d1fba660ef8d80b7aed))
- **ui:** remove redundant state update in selectMovie function ([54ed7ff](https://github.com/Seenivers/App/commit/54ed7ff6a99456f47817b25505a1e8a62ab77fe5))
- use an interface instead of a type for DropPayload. Best practice ([1d8a5ea](https://github.com/Seenivers/App/commit/1d8a5ea3856e17e5b54cb6654049a5f6729e1e7a))
- use optional chaining for collection ID check ([93788e5](https://github.com/Seenivers/App/commit/93788e5c4216e0d09d70f8d0950dc39bf1ca7aba))
- use optional chaining to simplify response check ([7b9fcba](https://github.com/Seenivers/App/commit/7b9fcba5ea7631a0b3d18f9bf4ab88088cc7f4c5))

### Features

- **add page:** implement drag-and-drop support for adding movies with file filtering and event listeners ([d000fda](https://github.com/Seenivers/App/commit/d000fdacf158e0f06aef0f789d821782bb106f48))
- **add-page:** add getValidFileNames function to filter file paths by valid extensions ([8cbd5ce](https://github.com/Seenivers/App/commit/8cbd5ce1c4061888a5beaaacb968382e75e701c7))
- **add/page:** refactor file handling with new helper functions ([411dea0](https://github.com/Seenivers/App/commit/411dea02007fb2ec960797afe3611cdf43dc3289))
- **addNewMovie:** update status during movie processing ([f59e34f](https://github.com/Seenivers/App/commit/f59e34f25124a13edc0754e59584250cd60231aa))
- **add:** refactor movie search handling to use writable store ([86af62a](https://github.com/Seenivers/App/commit/86af62a4c37d009d9ae1aa627385f448bd1c974d))
- **collection:** improve text readability on collection page ([eaa231f](https://github.com/Seenivers/App/commit/eaa231f5b92819ab3c530660cb680d9868fca86c))
- **db/functions:** add isCollectionIDUnique function to check collection uniqueness by ID ([98435e2](https://github.com/Seenivers/App/commit/98435e225270b9398859244c8574b0c99d64990c))
- **db:** add function to check if movie name is unique in database ([d393ab1](https://github.com/Seenivers/App/commit/d393ab171f67a948b933d76997e366292162b5b1))
- **dependencies:** enable HTTP/2 support for tauri-plugin-http ([4cc48d3](https://github.com/Seenivers/App/commit/4cc48d3fe1f2016cad08a2301e82ad147a52e4c4))
- **dnd:** handle drag and drop of files and directories with supported extensions ([b44c59a](https://github.com/Seenivers/App/commit/b44c59ac3fd3aae43171a25fda6fbf11093dc0cc))
- **download:** implement download queue for movies ([99904df](https://github.com/Seenivers/App/commit/99904df67a0edb5e4461d625a4ff12f99c2a54f4))
- **downloading:** Add support for downloading in buttonClass ([a7e28ac](https://github.com/Seenivers/App/commit/a7e28ac489884370bb21faab604555a32d3c41a7))
- **drag-drop:** update drag-and-drop logic to use file metadata checks ([24d3655](https://github.com/Seenivers/App/commit/24d36556cd0c0a54be22153f9d7367d6202a654b))
- **fetchImageDimensions:** handle invalid image dimensions by removing image and returning default size ([53e2eb6](https://github.com/Seenivers/App/commit/53e2eb6553d648840fc5677e944604c23ed1b21f))
- **icons:** add '📥' icon for 'downloading' search status ([72022df](https://github.com/Seenivers/App/commit/72022df3708dc8aa0773a23e45773fd5ee1525f6))
- **keyboard shortcuts:** add Ctrl++ and Ctrl+- handlers to adjust card scale ([55990b2](https://github.com/Seenivers/App/commit/55990b28129d2852d12d0817350d9d2b3e6cdf21))
- **keyboard shortcuts:** add Ctrl+P handler and improve shortcut functionality ([c054f15](https://github.com/Seenivers/App/commit/c054f15825e65c6c3d93605eef0538b9753e5ebb))
- **load function:** allow adding multiple files concurrently and avoid duplicate entries ([0de48eb](https://github.com/Seenivers/App/commit/0de48ebe841ca4b5ed76b16cd6cb646d1787c57d))
- **modal:** add message for unstarted search state ([8d33757](https://github.com/Seenivers/App/commit/8d337573885650524c857f93b6b4d4a0db89d4ef))
- **navbar:** clear search results on leave ([661b6b3](https://github.com/Seenivers/App/commit/661b6b3e298dc6f9e0332c7f414e333a1e19d56f))
- **network-status:** add isOnline store to track online status ([c6cbfd4](https://github.com/Seenivers/App/commit/c6cbfd448b70e6cdcb5354da05a7d17923818000))
- **page load:** add paths from query params and update +page.svelte to handle page data ([69ca098](https://github.com/Seenivers/App/commit/69ca098d5053ed8a4ce14d56aef256503a54bdaf))
- **page:** add movie state counters and use them in filter dropdown ([1e832ea](https://github.com/Seenivers/App/commit/1e832eacca2e779288a42c979014315cbc6986a3))
- **page:** enhance UI with additional file information ([8f3350d](https://github.com/Seenivers/App/commit/8f3350d273d3af5394b33f1416fc5237e64c8cf7))
- **search:** add MovieSearchState type for search status handling ([cb3879c](https://github.com/Seenivers/App/commit/cb3879c40280978c1a124b75d5d5def11a328a5e))
- **settings:** generate language options from navigator.languages and set default language ([a5ef4b9](https://github.com/Seenivers/App/commit/a5ef4b95d5288c2a201c12cb1e5f37ecdd91cc25))
- **stores:** create writable store for movie search status ([06b7bff](https://github.com/Seenivers/App/commit/06b7bffb162a8e13670806dfe1494a59f0ae112f))
- **styles:** update text color to use neutral-content for better theme consistency ([d3c2b46](https://github.com/Seenivers/App/commit/d3c2b46813f6414feb2ce242344d5d761c2d6744))
- **tailwind:** add unset values for minHeight and minWidth in theme extension ([8464b0f](https://github.com/Seenivers/App/commit/8464b0f1a8e81ec75132eac32831082d582239ae))
- **toast:** add backdrop blur effect and keep Info-Panel open by default ([50f0d58](https://github.com/Seenivers/App/commit/50f0d58d8a8990ec15979b81e8bf6adf5843485a))
- **toast:** enable collapse-plus for expandable info panel with toggle icon ([e7d1486](https://github.com/Seenivers/App/commit/e7d1486e2950c7d945325e94112a380f31b4ab2e))
- **toast:** enhance toast container with collapse info panel and custom styling ([25ec1e5](https://github.com/Seenivers/App/commit/25ec1e5aada0f22785afe90c10a9d47c98ec4d35))
- **types:** add 'downloading' status to SearchStatus type ([4b02761](https://github.com/Seenivers/App/commit/4b02761cc5f987390806817a6e40644ae87666ff))
- **types:** add Cardscale interface for scaling functionality ([e9bbc76](https://github.com/Seenivers/App/commit/e9bbc76968df827f38f1aec1c2a18c8f67c77e3f))
- **ui:** add card scaling with mouse wheel and refactor key handling ([d74e9fa](https://github.com/Seenivers/App/commit/d74e9faa51c254d331cf3d7091bb72b0a09d9540))
- **ui:** add dynamic highlighting for active scale buttons ([f7b442f](https://github.com/Seenivers/App/commit/f7b442fa651696e5d6b1057b0492dfcc9423e292))
- **ui:** add filtering and reset functionality for movie search status ([10af380](https://github.com/Seenivers/App/commit/10af38055c343e764aa9ff875186025d19c3fd3a))
- **ui:** enhance button styles with neutral background for scaling options ([4ffd2fd](https://github.com/Seenivers/App/commit/4ffd2fd4fcb3b32325e0364b454a4dd101a0c9de))
- **ui:** enhance scaling system with dynamic Cardscale model ([3442ef7](https://github.com/Seenivers/App/commit/3442ef722c3ef595c59548b6d0fc10204dcf27ad))
- **ui:** improve text and button labels for better clarity in movie selection flow ([d9e221b](https://github.com/Seenivers/App/commit/d9e221b819328cb4c1388b225ae4c97f147391c5))

# [0.13.0](https://github.com/Seenivers/App/compare/v0.12.1...v0.13.0) (2024-12-08)

### Bug Fixes

- add <title> tag to ensure title is present on page ([09bfa6c](https://github.com/Seenivers/App/commit/09bfa6c6531705d7efb615ea348c186d82774486))
- add braces to arrow function to resolve void expression issue ([7e62617](https://github.com/Seenivers/App/commit/7e62617e00bb8cc4194f4f7cac9277f36b4c1685))
- add eslint-disable-line to ignore 'any' type warning in database.ts ([c365eeb](https://github.com/Seenivers/App/commit/c365eeb2b1caaa3dc11db8c10922c30715e4d863))
- add SonarLint project configuration to .vscode/settings.json ([9fe09d6](https://github.com/Seenivers/App/commit/9fe09d612c98a4978114838cd0de78a4a9749aaa))
- change Promise rejection to use Error object for better error handling ([d8be583](https://github.com/Seenivers/App/commit/d8be58390b21539366eb467d91a4fd34245859b8))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.0.2 ([5e42c04](https://github.com/Seenivers/App/commit/5e42c0452bdb9574fef832040101a1b1ad3d1025))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.0.3 ([d134721](https://github.com/Seenivers/App/commit/d134721516a00b59f91e04182ce4d871729e53bf))
- **deps:** update dependency drizzle-orm to ^0.36.4 ([0f3b066](https://github.com/Seenivers/App/commit/0f3b066ce9d100dd5c4eeadea88878ac776b1309))
- **deps:** update dependency drizzle-orm to ^0.37.0 ([311939b](https://github.com/Seenivers/App/commit/311939b55e224c86f2eed4ee2e89f503258bd982))
- **deps:** update rust crate tauri-plugin-fs to 2.1.0 ([60a8fca](https://github.com/Seenivers/App/commit/60a8fcaf45f5ac3bb34771720d7ec40258ddcce4))
- **deps:** update rust crate tauri-plugin-shell to 2.0.2 ([705d978](https://github.com/Seenivers/App/commit/705d97841d80a94a4289239782890dab9428d29c))
- disable Svelte XSS warning for safe HTML rendering ([331acbc](https://github.com/Seenivers/App/commit/331acbc01794084caa2aea3fcec365d01abeb250))
- ensure movie data is updated only if new result is available ([ba11f80](https://github.com/Seenivers/App/commit/ba11f808b985374b236dea32c8565e283c6f04d9))
- ensure proper type conversion for unsafe arguments in searchMovies ([6a9f03d](https://github.com/Seenivers/App/commit/6a9f03d9bd9d6b748f74a99a2fd1ae2e6389ecf0))
- handle error object properly in image fetch by stringifying non-Error objects ([4167f53](https://github.com/Seenivers/App/commit/4167f5375c8017788f3c6f98856dd12ec20442e2))
- refactor class names to follow naming convention (typescript:S101) ([143663a](https://github.com/Seenivers/App/commit/143663ac99c2dcb415e5f0cbb933ee7d12c7f0c4))
- remove redundant cast and non-null assertion in dbMigrations assignment ([e7cba21](https://github.com/Seenivers/App/commit/e7cba2178e12628f482478314c47682b0ece0c86))
- remove redundant union type overriding in getMovieDetails ([c7adeb0](https://github.com/Seenivers/App/commit/c7adeb0e8c511545c819b221fa49dabfb9d2ae05))
- remove unnecessary import of Movie type from '$lib/types/movie' ([c814618](https://github.com/Seenivers/App/commit/c814618ffb227880c0c62c581976ce2e4f19f1a8))
- remove unused 'readTextFile' import to resolve linting error ([58d714d](https://github.com/Seenivers/App/commit/58d714d5d7eb6befbc1c16320fd5362f8be949ff))
- remove unused assignment of 'rows' in getDb function (typescript:S1854) ([15e6a53](https://github.com/Seenivers/App/commit/15e6a531f28e159a67e8c0611718afdf318bbca8))
- resolved migration execution issue caused by ArrayBuffer instead of string ([cfb2487](https://github.com/Seenivers/App/commit/cfb24874f16c56aefa44db4deafbb8e5e4c02de7))
- update dependabot.yml to conform with specification by using update groups ([93aeafa](https://github.com/Seenivers/App/commit/93aeafa04f8ed2686d7e7440fafdeaed5f58e541))
- update import for Movie type to reflect changes in type location ([9d90983](https://github.com/Seenivers/App/commit/9d90983dd85247fc6ee477a6c463aa8f3e0ca8ec))
- **update modal:** update German text for update modal and download progress ([eaafcd5](https://github.com/Seenivers/App/commit/eaafcd55697206bcfd98fbdd9ca223185a23dafe))
- **update:** improve update modal and download process logic ([172645b](https://github.com/Seenivers/App/commit/172645b9f7f5d2ced9127baebdb453673c1f7ba0))

### Features

- **db:** update drizzle schema and apply database migrations ([3cc66d6](https://github.com/Seenivers/App/commit/3cc66d660c99a9066d161fcd34feb9b901917541))
- **deps:** add marked for markdown parsing ([63308ca](https://github.com/Seenivers/App/commit/63308ca71641e6834230eec35af2c31eb3e90f25))
- **getAllCollections:** add function to retrieve all collections from the database ([4091592](https://github.com/Seenivers/App/commit/4091592b4e490b0cc940c3f0827694caecaad051))
- **homepage:** add scalable elements with adjustable sizes for optimal space usage ([e681dfc](https://github.com/Seenivers/App/commit/e681dfc3eded28948a58349d57de95cbfbe5a9a4))
- **modal:** improve responsiveness and layout for smaller screens ([bd14c86](https://github.com/Seenivers/App/commit/bd14c869f030173a6565105f6d5640721f60fd4d))
- **update-modal:** open external links in browser from changelog ([58f628c](https://github.com/Seenivers/App/commit/58f628c3ade3a2d92713b4529675b7df87d8e5ed))
- **updateCollection:** add function to update collections based on the defined time span ([72974de](https://github.com/Seenivers/App/commit/72974de9dc591e94ddb69f24339d0fc2f832198d))
- **updateMovies:** extend update logic for movies to include collections ([5f87d7c](https://github.com/Seenivers/App/commit/5f87d7cdd249a8b2cbcd62fa31c9676af437641e))
- **updater:** add Markdown support for update descriptions ([72f2dc5](https://github.com/Seenivers/App/commit/72f2dc5a7a52433fbdad1ae3725f114618639f6a))

## [0.12.1](https://github.com/Seenivers/App/compare/v0.12.0...v0.12.1) (2024-12-06)

### Bug Fixes

- **ci:** remove signing of migration files to avoid errors with .sql files ([f4d5de6](https://github.com/Seenivers/App/commit/f4d5de6bae051979788ebe019b248f5aa8c0d542))
- **windows:** update certificate thumbprint for signing ([3747195](https://github.com/Seenivers/App/commit/3747195606b4e3b66ff0e6e09c8ac0084da4e1d9))

# [0.12.0](https://github.com/Seenivers/App/compare/v0.11.0...v0.12.0) (2024-12-06)

### Bug Fixes

- add missing 'await' to handle Promises properly in movie data processing ([27407f4](https://github.com/Seenivers/App/commit/27407f4b920d9987c9c837176edeb77b5d9d9496))
- **api:** improve error handling and URL creation for `getMovie` function ([d8101d3](https://github.com/Seenivers/App/commit/d8101d37cd20e6282851de6484445d5f7c3d198e))
- avoid unsafe call of `error` type by properly typing config object ([0e29050](https://github.com/Seenivers/App/commit/0e290507600bcdd5d9bcd1d9e975beeb2dd31080))
- **deps:** update dependency @tauri-apps/plugin-log to ^2.0.1 ([ca49e00](https://github.com/Seenivers/App/commit/ca49e00c47de66877ad30082697df3123d234f8a))
- **deps:** update rust crate tauri-plugin-dialog to 2.0.4 ([a4ebd5f](https://github.com/Seenivers/App/commit/a4ebd5f88e0af88c24005c76dcce0b8cdd74e11f))
- **deps:** update rust crate tauri-plugin-http to 2.0.4 ([2111224](https://github.com/Seenivers/App/commit/21112242fd2e7de641cf4c8cc7f02e222df09777))
- **deps:** update rust crate tauri-plugin-log to 2.0.3 ([fdc20d0](https://github.com/Seenivers/App/commit/fdc20d092942dcde6901b017c8a56b6b5534d10c))
- extract duplicate error handling into a single function to avoid redundancy ([3e4549b](https://github.com/Seenivers/App/commit/3e4549b8e203199785fe423dfbdef3669e596e6c))
- **getIcon:** return '❓' as default icon instead of '🔍' ([f5536c9](https://github.com/Seenivers/App/commit/f5536c9303c231dab8f5fff1961ef9596276c8aa))
- improve error handling by checking if the error is an instance of Error ([59f36ab](https://github.com/Seenivers/App/commit/59f36ab02289239a93a758c22c7e72a7e95fb852))
- **player:** resolve unsafe error call by explicitly typing the error function ([73e2cf8](https://github.com/Seenivers/App/commit/73e2cf8503bda34afb5e7ba9fd00919b5e93b5f9))
- remove 'async' from 'getDb' function as it doesn't contain 'await' expressions ([80b9393](https://github.com/Seenivers/App/commit/80b939338e00dfe87b0549e5c6944e5d78f849d7))
- remove unused matchCurrentAge property from Renovate config ([709a58e](https://github.com/Seenivers/App/commit/709a58e2d3878d733413be4bab2df1409fae555c))
- replace logical OR with nullish coalescing operator for safer fallback handling ([db7e69e](https://github.com/Seenivers/App/commit/db7e69ecd8834e79445319f12c92804951dd7255))
- replace non-null assertion with runtime error check for settings initialization ([9ac0408](https://github.com/Seenivers/App/commit/9ac0408f6150fe4ab5aa05d1d45ab9c4ee83202f))
- resolve invalid 'never' type in template literal expression ([2bc2e4b](https://github.com/Seenivers/App/commit/2bc2e4b67241648bb6504ae1862305e9e49a3742))
- **search:** set status to 'notFound' when an error occurs during search ([a266b44](https://github.com/Seenivers/App/commit/a266b445e4e5df9eb20885bc435135dffa3a6bd4))
- **tauri:** remove year from copyright statement ([3565e6e](https://github.com/Seenivers/App/commit/3565e6eb7213b2d6779e32f0c6fd55c7872e6959))
- **tauri:** update Windows configuration with certificate and timestamp URL ([2d22af1](https://github.com/Seenivers/App/commit/2d22af1c08d92274060bdd71e04c00027da37fd4))
- use `unknown` for catch variable and handle errors safely in fullscreen toggle ([0108f32](https://github.com/Seenivers/App/commit/0108f3262fa3a1f4c756992128c463088602373d))
- **videoplayer:** ensure watchTime is not negative when saving progress ([a8ccb0e](https://github.com/Seenivers/App/commit/a8ccb0ef30fa81266af4db61ffdc0127c4586aca))

### Features

- **api:** add `getCollection` function to fetch collection details ([e817334](https://github.com/Seenivers/App/commit/e817334e3a939167e7ac22a4b9f8733599c0414a))
- **ci:** add Windows certificate import and resource signing to CI pipeline ([a13cd9a](https://github.com/Seenivers/App/commit/a13cd9ac51d3058769ad00bdffdd5b7025bb1e9f))
- **collection:** add toggle for grid/list view and improve layout ([3fa47d6](https://github.com/Seenivers/App/commit/3fa47d6e71cca8cc43b41b82f4ed5843a416ab03))
- **collections:** add collection handling when adding a new movie ([90d4880](https://github.com/Seenivers/App/commit/90d4880069d582e995b33b8fe76fc142569053c6))
- **collections:** implement collection page with movie details ([4c2fedc](https://github.com/Seenivers/App/commit/4c2fedc78a2fe2ba4b01e369f8f65882fa27c68c))
- **db:** add collection handling functions ([47d2d2f](https://github.com/Seenivers/App/commit/47d2d2fd6c8f60bea796fcd541f949aee34db6c5))
- **db:** update collections schema and add Movie type ([ba46662](https://github.com/Seenivers/App/commit/ba466620348aea6f57b9a2816fd7baf90e0a1a08))
- **images:** return image dimensions alongside source for optimized rendering ([e317a0a](https://github.com/Seenivers/App/commit/e317a0ac29b9f5bffbdeef77ae104048fe6af77a))
- **movie-detail:** add movie collection section and improve layout ([e6cb7c2](https://github.com/Seenivers/App/commit/e6cb7c2dfe656ef7e0e97a641813d62f5c3fecae))
- **renovate:** add automerge schedule for dependency updates ([78def08](https://github.com/Seenivers/App/commit/78def081a9799499c7762303c455a215208c77bd))
- **renovate:** update package rules and improve automerge configuration ([bc4bd8e](https://github.com/Seenivers/App/commit/bc4bd8edb06854496e2a616c362bd67e71bb349a))
- **tauri:** update bundle targets to include app, appimage, deb, dmg, msi, and rpm ([6a93bd6](https://github.com/Seenivers/App/commit/6a93bd6e7fbfdb96b1beff7df547c9f537175146))
- **types:** add `Collection` and `CollectionDetails` types for TMDB collection data ([6486135](https://github.com/Seenivers/App/commit/648613550663d6856a87bfa0d7d3ae3459880801))
- **ui:** improve movie detail layout for better readability and structure ([e5185fc](https://github.com/Seenivers/App/commit/e5185fc31c57e22ae2b8d267e058a3630418ef6d))

# [0.11.0](https://github.com/Seenivers/App/compare/v0.10.0...v0.11.0) (2024-12-01)

### Bug Fixes

- **db:** remove empty block to resolve no-empty linting error ([644870e](https://github.com/Seenivers/App/commit/644870ee4700135e5c27eb8a44782227b3647743))
- **dependencies:** update tauri-plugin-sql to v2.0.1 in Cargo.toml ([96c5833](https://github.com/Seenivers/App/commit/96c58335e7c79775de178310982cd6892f0459e1))
- **gender:** declare enum to avoid unused variable warning ([54dadad](https://github.com/Seenivers/App/commit/54dadad4806ec1a7f8f5dd446c0e187e2adef7f6))
- **loader:** remove unnecessary async modifier to comply with require-await rule ([f539691](https://github.com/Seenivers/App/commit/f539691136b9331fb2e5ad0ea0ab84d9c9db0331))
- **page:** avoid window undefined error by moving movie data loading to page.svelte ([43ea851](https://github.com/Seenivers/App/commit/43ea851a21699431e6a12100fd8c6ec26ae42ffe))
- resolve floating promises by using `void` to ignore unhandled promises in timeout function ([91639e8](https://github.com/Seenivers/App/commit/91639e821bdc67e3bc762648e559e9db76979cab))
- **schema:** replace [@ts-ignore](https://github.com/ts-ignore) with [@ts-expect-error](https://github.com/ts-expect-error) to comply with linting rules ([e1d1d36](https://github.com/Seenivers/App/commit/e1d1d3628ac44beae1663d762b8e8306ac008fec))
- **toast-duration:** increase default duration of new messages to 30 seconds ([5b509b3](https://github.com/Seenivers/App/commit/5b509b307b57d875188b03de512f3c20a3cfae8b))

### Features

- **add-movie:** add 'updated' timestamp when adding a new movie ([3325290](https://github.com/Seenivers/App/commit/33252907966f64edf4270053edfdcbe379963764))
- **config:** enable automerge for Renovate and adjust stability days ([7e744ef](https://github.com/Seenivers/App/commit/7e744ef061301aeb64c9b4d55ed6b8c8bdd497c1))
- **db:** add updated timestamp column to movies table ([8dbbb55](https://github.com/Seenivers/App/commit/8dbbb551023bdca78d8f74ea0f6a7c161e681633))
- **filters:** add name attributes to input and select fields for better identification ([d8bf7eb](https://github.com/Seenivers/App/commit/d8bf7eb7065d15f7e86bd879cfd81dfc7f176053))
- **image:** improve image processing with enhanced error handling and flexible download options ([29a6e29](https://github.com/Seenivers/App/commit/29a6e294f6ce83b59da17b055907a52ef1737623))
- **movie-update:** add periodic movie updates based on 'updated' field ([8922377](https://github.com/Seenivers/App/commit/89223774e6604b50bbcd48b7d66d3f30a28d4c2f))
- **movie:** add image loading for movie poster and cast profiles when adding a new movie ([ade1379](https://github.com/Seenivers/App/commit/ade13797a58080e50a48671312eb1f759c5333a4))
- **ui:** add app version to settings footer ([2d09885](https://github.com/Seenivers/App/commit/2d09885435f81c52c61d2966ffccdeb24d3457c4))
- **ui:** improve datalist behavior by adding null checks for search input and datalist items ([8475bef](https://github.com/Seenivers/App/commit/8475bef9bb7947a48d3a0b1add4a43915b86b966))

# [0.10.0](https://github.com/Seenivers/App/compare/v0.9.0...v0.10.0) (2024-11-22)

### Bug Fixes

- **csp:** allow inline styles by adding 'unsafe-inline' to style-src ([c1caf1f](https://github.com/Seenivers/App/commit/c1caf1f81031b8651e5777e072fb9274645ab8e7))
- **deps:** update tauri monorepo ([4fb880f](https://github.com/Seenivers/App/commit/4fb880f618998e41217311252df062b795bc631d))

### Features

- **config:** add schedule to Renovate configuration and adjust automerge settings ([a450dad](https://github.com/Seenivers/App/commit/a450dadf1d4a28a4ad102b58de1a2d25857546ab))
- **logging:** add console and logger integration in Svelte layout ([51e23d6](https://github.com/Seenivers/App/commit/51e23d65ba5645109d5d020c02224a0e017ee283))
- **logging:** integrate advanced logging with @tauri-apps/plugin-log ([6301d3f](https://github.com/Seenivers/App/commit/6301d3fe458842b5a93e80592c37a92220670979))
- **video-player:** add save function on component destroy to update playback state ([fe5d260](https://github.com/Seenivers/App/commit/fe5d26021a364bb60e3b853a2ffa1b9f872ce2ae))

# [0.9.0](https://github.com/Seenivers/App/compare/v0.8.0...v0.9.0) (2024-11-20)

### Bug Fixes

- **config:** enhance window properties and update installer languages in Tauri config ([e8575bc](https://github.com/Seenivers/App/commit/e8575bc7f85aacde3be6634aab81d053e007033f))
- **image:** resolve invalid template literal type for error handling ([5a2a746](https://github.com/Seenivers/App/commit/5a2a746d44d9ba63ed97f73b35600f99416ae6e1))
- **image:** resolve type error in error handling message ([3ae7c7b](https://github.com/Seenivers/App/commit/3ae7c7bb31f6a238ef6509f9416eaca986ca2549))
- **prerender:** adjust prerender entries to include all routes and handle missing IDs ([142df43](https://github.com/Seenivers/App/commit/142df43c084b909cc517c0ae8261472183433821))
- **release:** fetch latest commit to ensure correct version is used ([99b18fd](https://github.com/Seenivers/App/commit/99b18fd3e2e484b47c5ee6639efd5b900ab87c46))
- **toast:** remove redundant type annotation for duration parameter ([a57e7bd](https://github.com/Seenivers/App/commit/a57e7bd4eec57b5fcb9f0212beee262f923c08d4))
- **types:** convert Settings type to interface for consistency ([7409279](https://github.com/Seenivers/App/commit/7409279e8a669454d6b04a8625a598079c125713))

### Features

- **layout:** disable default context menu ([0f32310](https://github.com/Seenivers/App/commit/0f32310c8dddae84297d43d90edc494dbc58054a))
- **settings:** add settings page and integrate it into the main navigation ([c72e08b](https://github.com/Seenivers/App/commit/c72e08bc85db0ed81a3dbc37a5e47aa0424557ec))
- **toast:** add animations and optimize toast rendering ([23002b8](https://github.com/Seenivers/App/commit/23002b8f043df4aae5571e6a5b0b5b632816a3c0))
- **toast:** increase default duration to 30 seconds ([e80309a](https://github.com/Seenivers/App/commit/e80309ac94dcd60972b1a5680bce7071139dfe47))

# [0.8.0](https://github.com/Seenivers/App/compare/v0.7.0...v0.8.0) (2024-11-18)

### Bug Fixes

- **cors:** resolve CORS issue by switching to Tauri's HTTP fetch ([9c8fad1](https://github.com/Seenivers/App/commit/9c8fad1954d980e07c4cadc41762d20fb6eb5475))
- **images:** replace placeholder URL with inline NoImage SVG ([eb1aa31](https://github.com/Seenivers/App/commit/eb1aa31cf7775ac4daccc8840315e26a51960c3a))
- **search:** add check to prevent errors when matchedMovies is empty ([ca3516d](https://github.com/Seenivers/App/commit/ca3516de5d4dc80858ca3d3d6d60918d7fcda5fc))

### Features

- **images:** add NoImage SVG placeholder for missing images ([09d5000](https://github.com/Seenivers/App/commit/09d5000f36316e991724f718cc8e2c447b0150e4))
- **search:** show search filters only when movies are matched ([922de4f](https://github.com/Seenivers/App/commit/922de4f2505ebf8725b041da266583a3c07f6945))

# [0.7.0](https://github.com/Seenivers/App/compare/v0.6.1...v0.7.0) (2024-11-18)

### Bug Fixes

- **image-function:** handle null or undefined paths and return placeholder URL ([3d093cc](https://github.com/Seenivers/App/commit/3d093cc2e7218df41244ba3156716735c39558e6))
- **init:** handle errors when fetching movie data during settings initialization ([ba86b25](https://github.com/Seenivers/App/commit/ba86b259cd3fead6db22cff8f3c24844f1ec165d))
- **parsing:** specify radix parameter for parseInt to avoid unexpected results ([8fb42e7](https://github.com/Seenivers/App/commit/8fb42e71c92c6b24a7f88e58bcbc206ca36c7fae))

### Features

- **cast:** add clickable cast items with character names and links to TMDb profiles ([4368a37](https://github.com/Seenivers/App/commit/4368a3776e03d056214587d2401806fd61e9a4d5))
- **images:** implement image downloading and caching mechanism ([2bb233c](https://github.com/Seenivers/App/commit/2bb233cd9514e55659e2b71c276e7b0820d8bd99))
- **movie-details:** add cast carousel and placeholder for missing images ([85f7829](https://github.com/Seenivers/App/commit/85f78290a7f5f0a4789244321e347be7014f497f))
- **navbar:** add dynamic image fetching for video player poster ([6a8e2d6](https://github.com/Seenivers/App/commit/6a8e2d64f7d37b3c5c0ac92bec6a8925ed2e80e7))
- **network:** add condition to hide updater in development environment ([19c2a42](https://github.com/Seenivers/App/commit/19c2a42175131c80a68f885df2b85cbe6f0ad271))
- **permission:** extend file system permissions and allow write access ([ab27774](https://github.com/Seenivers/App/commit/ab2777426c26bf5a9a3e78e71d119f7894e26372))
- **security:** enhance CSP configuration and disable asset CSP modification ([dedd82f](https://github.com/Seenivers/App/commit/dedd82fc496ea0b8de21722646f73168ca6e05f6))
- **tauri:** update config for improved window positioning and bundle details ([fa24d0a](https://github.com/Seenivers/App/commit/fa24d0adfa7a3d41753274e6cad8091a723c90b1))
- **types:** add searchMovie.ts to define Search and Movie interfaces ([9dedcb3](https://github.com/Seenivers/App/commit/9dedcb3b5722888158bdfcca8ee74b7db952bfcf))
- **urls:** add seeniversURL constant for app's base URL ([1ef8344](https://github.com/Seenivers/App/commit/1ef8344c3ec5cc750b2dda92f81b347512854a0a))

## [0.6.1](https://github.com/Seenivers/App/compare/v0.6.0...v0.6.1) (2024-11-15)

### Bug Fixes

- **sqlite:** correct database file naming for DEV environment ([a19fd1c](https://github.com/Seenivers/App/commit/a19fd1cbf0ed21b52b00a4ffbbb63d2e471d1294))

# [0.6.0](https://github.com/Seenivers/App/compare/v0.5.0...v0.6.0) (2024-11-15)

### Bug Fixes

- **api:** add error handling to `getMovie` function for failed requests ([1934e22](https://github.com/Seenivers/App/commit/1934e2266996521057f7f6a700ef31602711cace))
- **cleanup:** add unsubscribe call to cleanupData function ([3625843](https://github.com/Seenivers/App/commit/36258439ea4a73797a2ea1478771f6cd2cbfaeaa))
- **cleanup:** remove unused imports ([98e31dc](https://github.com/Seenivers/App/commit/98e31dce53a6e8fd0e52e5bb95b5318d2f253e98))
- **db:** set `path` as unique in `movies` schema to prevent duplicate entries ([794a0ed](https://github.com/Seenivers/App/commit/794a0ed7b85081631226d9fdb1890d90c346f4d6))
- **db:** set default value of 1 for `id` in `settings` table to ensure single instance ([17ef2f2](https://github.com/Seenivers/App/commit/17ef2f20bdcbcefa5c8d51fcb9b327493201b801))
- **errors:** resolve unused expressions and add error handling for isPathUnique ([f4d882b](https://github.com/Seenivers/App/commit/f4d882b612e4a77e5b023946adc84bbb1939b58a))
- **migration:** remove optional chaining in `hasBeenRun` function for hash comparison ([f7ea86b](https://github.com/Seenivers/App/commit/f7ea86b64856521a229daa6ed1811c47fe96a879))
- **online status:** remove async from `addCustomEventListener` as it doesn't use await ([49420a5](https://github.com/Seenivers/App/commit/49420a537647c5ea35325ccb3981a8f3cfad4fea))
- **optimization:** use 'const' for sqlite initialization ([f1eb789](https://github.com/Seenivers/App/commit/f1eb789c19561dd5ad467cf57cdcfc9089efcd1b))
- **permissions:** add `sql:allow-execute` to desktop permission config ([7243ecd](https://github.com/Seenivers/App/commit/7243ecdc274faa4d8332742f95bf418006916dff))
- **player:** improve controls visibility handling when video is paused ([d84e82a](https://github.com/Seenivers/App/commit/d84e82a03fba4deff451d1a41cf98962f64dc587))
- **schema:** export schema components explicitly for drizzle-kit compatibility ([d2fc5e9](https://github.com/Seenivers/App/commit/d2fc5e989a8482cad1908d4c965aa32363d7807a))
- **store:** ensure type compatibility for saved data and default settings ([db11ce5](https://github.com/Seenivers/App/commit/db11ce52cc148e19fd7b2c60575c891a799e59a3))
- **toast:** update settings import and handle null values for toast position ([ac182ec](https://github.com/Seenivers/App/commit/ac182ec52fecb61b2e3660fbc1e9ac29137d2cfa))
- **types:** replace 'any' with 'string[]' in newToast function ([971df07](https://github.com/Seenivers/App/commit/971df07d6597d0f681c6d108ab95940fb0c0c909))
- **types:** replace 'any' with precise type using schema inference in filterMovies ([a7f8f67](https://github.com/Seenivers/App/commit/a7f8f67d437845fb36d7de27ee6c66dc780681c8))
- update language retrieval to check for data validity ([fa52c98](https://github.com/Seenivers/App/commit/fa52c98db9f29380cbb6c5293469eaab2c37a073))
- **update:** improve update check on internet connectivity ([28f7465](https://github.com/Seenivers/App/commit/28f74654020427870aad454f1cea718c5be5518f))
- **updater:** improve error handling for offline status and replace alert with toast notification ([25c89cf](https://github.com/Seenivers/App/commit/25c89cfd0aed7f7e03433d4d9a565a8c6bc1a2c8))
- **vite.config.ts:** replace `||` with `??` for better nullish coalescing ([ff281a8](https://github.com/Seenivers/App/commit/ff281a89a408d82aca42f16a19d679dc26637922))

### Features

- **api:** add function to fetch movie details by ID ([4c728e7](https://github.com/Seenivers/App/commit/4c728e7bdc7286c5b054e6c51cd6b2bf39e5b11e))
- **database:** add CRUD functions for movies ([150cf01](https://github.com/Seenivers/App/commit/150cf0174cdf407c616020df467d1c3b20550653))
- **database:** add SQLite with @tauri-apps/plugin-sql ([ff851ae](https://github.com/Seenivers/App/commit/ff851aee59e521bbef94feba0e2fae40894829f2))
- **db:** add database connection and migration setup ([84a9b2d](https://github.com/Seenivers/App/commit/84a9b2d0251533d8d1ae379ecc648f99e290b8c6))
- **db:** add database schemas ([9cd7183](https://github.com/Seenivers/App/commit/9cd7183967bc4be8457ea6bceb7073f14b107dbc))
- **db:** add Drizzle config and migration resources to Tauri config ([6526445](https://github.com/Seenivers/App/commit/652644519948a5736496dea751f068aeb42e6301))
- **db:** add Drizzle scripts and dependencies for database migrations ([5021c11](https://github.com/Seenivers/App/commit/5021c1157227c32bca389ea6c56154dfee89be1f))
- **db:** implement centralized database operations and settings initialization ([ee6802f](https://github.com/Seenivers/App/commit/ee6802f1bea8baebb285b78a61b0dddaf8caa7b7))
- **db:** integrate Tauri FS for initial movie import and settings initialization ([c94d2ee](https://github.com/Seenivers/App/commit/c94d2ee308ba48c9328de04148fc063eacc989a4))
- **file-management:** refactor movie addition and filtering logic with async path checks ([a292170](https://github.com/Seenivers/App/commit/a2921703e88eab6fbdfd167d9d0a21fc73c33e12))
- **migrations:** generate migration files ([3c3936b](https://github.com/Seenivers/App/commit/3c3936bd556f7ef27f2d838abeb6a5b4968255ea))
- **movie-details:** refactor movie details page with DB integration and external player support ([7dfb6fa](https://github.com/Seenivers/App/commit/7dfb6fa534fab2c346b2a9a282a05a49cbd2d2aa))
- **online-status:** add toast notifications for online/offline status changes ([0655678](https://github.com/Seenivers/App/commit/06556781468f0a5d25fa57ce44bfefe46f38f9bb))
- **search:** refactor movie search with database integration and Fuse.js ([a98036a](https://github.com/Seenivers/App/commit/a98036abf2df5cf28d6325e56c994c9f0f3263de))
- **settings:** add default language initialization based on browser locale ([883c771](https://github.com/Seenivers/App/commit/883c7714b8eae2a4a3f5cb2f958223512e78c472))
- **tauri:** add category and homepage to bundle configuration in tauri.config.json ([21540db](https://github.com/Seenivers/App/commit/21540dbccf2d4eae72ce29876a3f4679589e8885))
- **tauri:** add shell plugin ([65c724d](https://github.com/Seenivers/App/commit/65c724dce56ddda093d7945f4b0dc4e17324312d))
- **toast:** allow additional arguments for flexible message formatting ([6ea7624](https://github.com/Seenivers/App/commit/6ea762430fdc9ac5f50e2eb63420d56840c5fa77))
- **types:** add new Movie type in types folder ([f060fde](https://github.com/Seenivers/App/commit/f060fded1838e6d73c66f8be1daa673c131a4c12))
- **ui:** add migration call on app load ([b5098c7](https://github.com/Seenivers/App/commit/b5098c705a052eb01d706ce51fe157cc84620859))
- **ui:** conditionally render Updater component based on online status ([582c304](https://github.com/Seenivers/App/commit/582c304f293d9b5f328a911cb1939ce5cbc67cb0))
- **video:** implement database integration for movie watch time and status ([a163978](https://github.com/Seenivers/App/commit/a163978f3ca3ab60fc9343544cbdba756e239ca3))

# [0.5.0](https://github.com/Seenivers/App/compare/v0.4.1...v0.5.0) (2024-10-31)

### Bug Fixes

- **accessibility:** adjust svelte-ignore comment placement for a11y-media-has-caption issue ([83a1e58](https://github.com/Seenivers/App/commit/83a1e58bfb113f75b44a6da4e06e5a83810d9881))
- **accessibility:** adjust svelte-ignore comment placement for a11y-media-has-caption issue ([29e92bb](https://github.com/Seenivers/App/commit/29e92bb78b7bafaae44624f675fe74fa233dfbd8))
- **deps:** update dependency @tauri-apps/plugin-dialog to ^2.0.1 ([e72dd62](https://github.com/Seenivers/App/commit/e72dd6230c13123ccf6fd6399c376d78073e5088))
- **deps:** update dependency @tauri-apps/plugin-dialog to ^2.0.1 ([ed1de57](https://github.com/Seenivers/App/commit/ed1de57090541ecc62fc20587013f7e3f8906914))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.0.1 ([aec0973](https://github.com/Seenivers/App/commit/aec097309ef388318709707bbbf5c47a129c7945))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.0.1 ([7b6091a](https://github.com/Seenivers/App/commit/7b6091ae21c44a2cc974d9648132d3e189528925))
- **deps:** update dependency @tauri-apps/plugin-http to ^2.0.1 ([54f6769](https://github.com/Seenivers/App/commit/54f67692512ada6ae0b7c2924b65a87fbaa62aeb))
- **deps:** update dependency @tauri-apps/plugin-http to ^2.0.1 ([694e657](https://github.com/Seenivers/App/commit/694e65734f3927981b9fda26b52ccca51c55ef0b))
- **deps:** update rust crate log to 0.4.22 ([abb6e18](https://github.com/Seenivers/App/commit/abb6e18538b41998accc79271484bbc75d51b752))
- **deps:** update rust crate log to 0.4.22 ([d002197](https://github.com/Seenivers/App/commit/d0021977d77ab5b6d550d9e86d0e4b8e9c1ccc66))
- **deps:** update rust crate serde to 1.0.213 ([d996a3b](https://github.com/Seenivers/App/commit/d996a3b0b0d4092df5e23b537d12201556359925))
- **deps:** update rust crate serde to 1.0.213 ([44fae04](https://github.com/Seenivers/App/commit/44fae04edb41056cd191116d8c30cd359223ffa2))
- **deps:** update rust crate serde to 1.0.214 ([c71e24e](https://github.com/Seenivers/App/commit/c71e24ef86099cba5676ff178db1dd7d29efa6f6))
- **deps:** update rust crate serde to 1.0.214 ([e8fd66a](https://github.com/Seenivers/App/commit/e8fd66a36f6a287df97ddd2335ac34c2b066a5dc))
- **deps:** update rust crate serde_json to 1.0.132 ([628ad63](https://github.com/Seenivers/App/commit/628ad63a805531085bc832bb356187721fc2cb81))
- **deps:** update rust crate serde_json to 1.0.132 ([38337f6](https://github.com/Seenivers/App/commit/38337f661ce001975b24fa97ded90436617847f1))
- **deps:** update rust crate tauri-plugin-dialog to 2.0.3 ([5d15603](https://github.com/Seenivers/App/commit/5d15603887b09b4b5901c3544a22f81367cbcd2a))
- **deps:** update rust crate tauri-plugin-dialog to 2.0.3 ([71e8824](https://github.com/Seenivers/App/commit/71e8824fc9240b559103b52253b03ea011a41794))
- **deps:** update rust crate tauri-plugin-fs to 2.0.3 ([ab6bf2c](https://github.com/Seenivers/App/commit/ab6bf2c7baf51e1159b9f769b9eba48977d629e8))
- **deps:** update rust crate tauri-plugin-fs to 2.0.3 ([91e1804](https://github.com/Seenivers/App/commit/91e18041c40fe78edac3b967353af2b4b13e05dc))
- **deps:** update rust crate tauri-plugin-http to 2.0.3 ([856dc3c](https://github.com/Seenivers/App/commit/856dc3cf2a01f3e00b4ad10e02d5e25863326695))
- **deps:** update rust crate tauri-plugin-http to 2.0.3 ([c130333](https://github.com/Seenivers/App/commit/c130333633f6021ee05e8af81c2373069b8450f9))
- **deps:** update rust crate tauri-plugin-log to 2.0.1 ([2584981](https://github.com/Seenivers/App/commit/2584981ed365733ceef07142f681efba832a2f67))
- **deps:** update rust crate tauri-plugin-log to 2.0.1 ([9441abf](https://github.com/Seenivers/App/commit/9441abf7a7640efd080e37b06bbdc0115d71af5f))
- **deps:** update rust crate tauri-plugin-process to 2.0.1 ([b74b619](https://github.com/Seenivers/App/commit/b74b619e4348c2188500f7da562ee76496fd17d6))
- **deps:** update rust crate tauri-plugin-process to 2.0.1 ([b493b6e](https://github.com/Seenivers/App/commit/b493b6e4e9f810b947d432ba830a033385391911))
- **deps:** update rust crate tauri-plugin-store to 2.1.0 ([fab307e](https://github.com/Seenivers/App/commit/fab307efd52a388ad46199d2d6595e1f0df0e514))
- **deps:** update rust crate tauri-plugin-store to 2.1.0 ([c58856e](https://github.com/Seenivers/App/commit/c58856ebe9d25e8e6e9c0bb17017092c6db55032))
- **deps:** update rust crate tauri-plugin-store to v2.1.0 ([680a334](https://github.com/Seenivers/App/commit/680a3345003433e06598cc92018f3f6dfa54174c))
- **deps:** update rust crate tauri-plugin-updater to 2.0.2 ([6eb1de1](https://github.com/Seenivers/App/commit/6eb1de152f4571b68e64f0c73f65b95195be81af))
- **deps:** update rust crate tauri-plugin-updater to 2.0.2 ([4b01e0c](https://github.com/Seenivers/App/commit/4b01e0c2e3ce82a6107a995961843fb26be72afb))
- **deps:** update tauri monorepo ([faa3d5e](https://github.com/Seenivers/App/commit/faa3d5e961a92fa5adaa63a5eecf2a4198ab2e11))
- **download:** add internet connection check with early return in download function ([0e4acc5](https://github.com/Seenivers/App/commit/0e4acc58dec89fb9105affb7feca59eee01e4ade))
- **download:** add internet connection check with early return in download function ([bebfd11](https://github.com/Seenivers/App/commit/bebfd1144d929572c5ce011af74d41f9e66a1a99))
- **download:** remove "[@ts-ignore](https://github.com/ts-ignore)" by ensuring "contentLength" is always defined ([a2e77d6](https://github.com/Seenivers/App/commit/a2e77d6b3c803a12637c2a4da2117d359b82e449))
- **download:** remove "[@ts-ignore](https://github.com/ts-ignore)" by ensuring "contentLength" is always defined ([77ac00a](https://github.com/Seenivers/App/commit/77ac00a0087a83c903cbf969fda5abcb43216b5a))
- **release:** correct asset count check in Tauri Release workflow ([d3fe762](https://github.com/Seenivers/App/commit/d3fe762cf01bc6982a7907c046d335e424529123))
- **release:** correct release details formatting in environment variables ([df353c2](https://github.com/Seenivers/App/commit/df353c2714e56fb62ddcc646e7fa93ab2be40b90))
- **release:** include asset count in message when skipping Tauri Release ([edc0370](https://github.com/Seenivers/App/commit/edc0370b2720ee8e9521c871531552fd6927bced))
- **release:** manually bump version to 0.5.0 due to semantic-release issue ([b928ef3](https://github.com/Seenivers/App/commit/b928ef3abf342fb6f0ce94d5e95970dd7b456ed0))
- **release:** remove unnecessary escape sequence from body processing ([2d61cab](https://github.com/Seenivers/App/commit/2d61cabfc76df773fb3984a145483342b1b028f2))
- **release:** remove unnecessary escape sequence in release body processing ([bf3073f](https://github.com/Seenivers/App/commit/bf3073f18a874f1d1640a50c2c0aadae52d4f264))
- **release:** revert asset count retrieval to gh release view for accuracy ([d700626](https://github.com/Seenivers/App/commit/d700626ea2883c5cae7872f3e73e1e91dfaf1be6))
- **release:** store asset_count in environment and update condition check ([502b221](https://github.com/Seenivers/App/commit/502b2217c48de1737dc158c35caa2ad8355687f7))
- remove unnecessary try/catch wrapper in file creation ([870a9ba](https://github.com/Seenivers/App/commit/870a9ba2c2a5773dac4904dace30f4aac6704848))
- replace double quotes with single quotes in body escaping ([924cdb0](https://github.com/Seenivers/App/commit/924cdb003464ade34cfd157c36709b91f5cba10a))
- **types:** remove unused player parameter from elemente function ([2762b81](https://github.com/Seenivers/App/commit/2762b814f6a715afa6aaa043b956bba705548886))
- **types:** remove unused player parameter from elemente function ([391b731](https://github.com/Seenivers/App/commit/391b7317cf599eb37cc5ca5cd0e368ab7d9eeecd))
- **types:** replace any with generics in Store class for better type safety ([f9d0459](https://github.com/Seenivers/App/commit/f9d04592a4dfc8fdff5b4d7d16f1d19afef8b17f))
- **types:** replace any with generics in Store class for better type safety ([6de55de](https://github.com/Seenivers/App/commit/6de55dea00732321a2b8cb76c28fdb42a46c54ae))
- **workflow:** add GitHub token to log release details step ([9280eea](https://github.com/Seenivers/App/commit/9280eeae4f227b369680359505b3c073eb33a0d8))
- **workflow:** correct syntax in Check Asset Count step ([6bc569a](https://github.com/Seenivers/App/commit/6bc569a69143464b5a565e12b33f6be669f12652))
- **workflow:** escape newlines in release body for artifact upload ([f16b999](https://github.com/Seenivers/App/commit/f16b999bcc60d8bc6f74fa263b703f0b06df7f18))
- **workflow:** remove extra 'v' from release name to avoid 'vv...' issue ([3819e9c](https://github.com/Seenivers/App/commit/3819e9c364daeb1ff7e4b3d7defa3b25b51c33a3))
- **workflow:** replace sed with awk and printf for better cross-platform compatibility ([e212fc2](https://github.com/Seenivers/App/commit/e212fc27d3a737bb32c9794f2a3d96990d4d2681))
- **workflows:** escape line breaks in release body for JSON compatibility ([7da6563](https://github.com/Seenivers/App/commit/7da65634b69dd952236609822b82b8bb38bded0d))
- **workflow:** update sed command for cross-platform compatibility on macOS and Linux ([b931532](https://github.com/Seenivers/App/commit/b931532177ceee840f7a9bddf5fd97bd9d9303fe))

### Features

- **action:** add custom GitHub Action for automating releases with Changesets ([8b47706](https://github.com/Seenivers/App/commit/8b477068a51ea097b0e2f88c19cfe614ae86cd8f))
- **ci:** add asset count check to semantic-release job and streamline release workflows ([e4a8fae](https://github.com/Seenivers/App/commit/e4a8fae3cd8838b1e52da30caffc79542fdde7bf))
- **ci:** update release workflow to include asset count check before Tauri release ([f899b07](https://github.com/Seenivers/App/commit/f899b07277a7568f35069ac7662fe7ec13ba9fe6))
- **release:** add asset count check to skip Tauri Release if more than 3 assets found ([43a6c96](https://github.com/Seenivers/App/commit/43a6c965260abb4284e94a3c359f36de83384a6b))
- **release:** add bump and release scripts with changeset integration ([914b76a](https://github.com/Seenivers/App/commit/914b76aedc5aecb7450b9625e956f9a3258a6647))
- **release:** add conditional execution for Tauri Release based on successful Semantic Release ([6a218f1](https://github.com/Seenivers/App/commit/6a218f15f7c798e306266d6f82674ea4a8271caf))
- **release:** add release check and conditional Tauri release steps ([6291656](https://github.com/Seenivers/App/commit/62916568ac13633ca4811fd6dbbd4b2aecd41798))
- **release:** add shell: bash to Read Release Details step for improved compatibility ([733a1ec](https://github.com/Seenivers/App/commit/733a1ecc67594f8e22a1424081b19fa30bddd20b))
- **release:** add support for tag-based releases ([a7f0320](https://github.com/Seenivers/App/commit/a7f032080ab26ea18bc4dd7e0bd68b928c3745a2))
- **release:** create reusable Tauri Release action for publishing Tauri app ([8788a8f](https://github.com/Seenivers/App/commit/8788a8f83aee4ee32f5aa1ac8e34afd4c1693eb1))
- **release:** escape newlines and quotes in release body for consistent formatting ([2a13f31](https://github.com/Seenivers/App/commit/2a13f31427f894f9750d9b633320b597d8595549))
- **release:** improve release workflow by dynamically passing release details between steps ([80002ff](https://github.com/Seenivers/App/commit/80002ff0ba9d70b6be382f6fdd577e9c9e96b39f))
- **release:** integrate semantic-release with configuration for main and next branches ([225e751](https://github.com/Seenivers/App/commit/225e751446e34f902f2a38efe374ba8ac6eece1d))
- **release:** remove carriage returns and escape newlines and quotes in release body ([9e310bb](https://github.com/Seenivers/App/commit/9e310bbcbca84104e305b9960bf9f0c0c38da181))
- **release:** update GitHub Actions workflow to include asset count check for Tauri Release ([d946f7e](https://github.com/Seenivers/App/commit/d946f7e6f0bf670da78aa29c57e32f9c7f750607))
- **release:** update Read Release Details step to use environment variables ([de3b82f](https://github.com/Seenivers/App/commit/de3b82f9f01acab658caae064282dfce1b5467dc))
- **release:** update Tauri release workflow to use environment variables for release details ([bb115ae](https://github.com/Seenivers/App/commit/bb115aefd002e025977ef99f216f1be45e9461f7))
- **workflow:** add GH_TOKEN to Semantic Release for output variable extraction ([450bd9a](https://github.com/Seenivers/App/commit/450bd9a84242093a39eeaaaee98d8340a95e02d9))
- **workflow:** change Tauri Release trigger to workflow_call ([1e94eef](https://github.com/Seenivers/App/commit/1e94eeff3dca10a17a4a6b8271d13b22aad2a95a))
- **workflow:** enable Tauri Release for workflow_dispatch triggers ([d9b2bac](https://github.com/Seenivers/App/commit/d9b2bac495746c0b0268e271bb85a0a1ce3ae853))
- **workflow:** implement artifact download and clean-up in Tauri release job ([921ae12](https://github.com/Seenivers/App/commit/921ae1229a2ab1100653ed317a24040eae6f6f3c))
- **workflow:** integrate Tauri workflow call after semantic release ([06be567](https://github.com/Seenivers/App/commit/06be567ae2aac7c15a4a23f18c769264495433c7))
- **workflow:** merge Semantic Release and Tauri workflows into a single release process ([f8ca7f2](https://github.com/Seenivers/App/commit/f8ca7f25bed035e67b1877024216efb922b68c78))
- **workflow:** refactor Tauri Release to use inputs for release details ([7ad079a](https://github.com/Seenivers/App/commit/7ad079a52b96a6ae6b7c87c1b1045ab26300567f))
- **workflow:** remove release.yml from GitHub Actions ([b0cf262](https://github.com/Seenivers/App/commit/b0cf2623fd275f853c7ffab88ad549feb322f8d0))
- **workflow:** simplify output handling and log release details ([b2c9008](https://github.com/Seenivers/App/commit/b2c90081ee0b8f460505d8170a98adfe2e689baf))
- **workflows:** pass secrets as inputs to Tauri Release workflow ([c68d291](https://github.com/Seenivers/App/commit/c68d291f4bcac2698f0a4d069275cb675bbbc7f1))
- **workflow:** update Semantic Release to trigger on push and set output variables ([ae6fba8](https://github.com/Seenivers/App/commit/ae6fba8661c2fdad2886e6836c5bcbf02928cf5f))

# 0.4.1

### Patch Changes

- 13afa10: simplify workflow by removing versioning step in Changesets Release
- f992d7c: update Changesets configuration to disable automatic commits and add private packages support
- a547285: exit fullscreen mode at the end of the movie or video

# 0.4.0

### Minor Changes

- c3cd412: switch to Changesets action for creating release pull requests
- 582af72: generate release notes and update release creation step

# 0.3.0

### Minor Changes

- d69b614: rename release workflow to 'Tauri Release' and update release name to 'Tauri'

# 0.2.0

### Minor Changes

- 8cd8005: add permissions for handling pull requests in Changesets workflow
- 270ad0e: add Changesets workflow for automated releases
- e0bfa2d: enable commit and set access to public
- 6004c67: add Changesets CLI for versioning
