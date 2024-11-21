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
