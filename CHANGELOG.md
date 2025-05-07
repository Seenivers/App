# [0.32.0](https://github.com/Seenivers/App/compare/v0.31.2...v0.32.0) (2025-05-07)


### Bug Fixes

* **actor:** improve biography section layout and conditional rendering ([f6f6e12](https://github.com/Seenivers/App/commit/f6f6e127d3be117b6fd30d70bb33ee6d2835bcc5))
* **backup:** conditionally render 'Neue Daten Bank' button in DEV environment ([9ce3601](https://github.com/Seenivers/App/commit/9ce36012b4fd690d22148e6cbd066106c2ac82ed))
* **nextEpisode:** remove debug logging for next episode URL generation ([735f005](https://github.com/Seenivers/App/commit/735f00528f78289e4dec05e84796feb7669e941f))
* **settings:** ensure settings are saved and toast notification is displayed ([50940b8](https://github.com/Seenivers/App/commit/50940b80d290aa724b023c11df2a9b8c7b7cc23f))


### Features

* **actor:** add movie and TV icons to filmography list ([3d0062e](https://github.com/Seenivers/App/commit/3d0062ebb53cdef788868f57d7a58920b5276893))
* **i18n:** add 'leadActor' translation and update movie page to use it ([24811cc](https://github.com/Seenivers/App/commit/24811cc1502979f0e76f3c4102beeb54fa219902))
* **i18n:** add German localization for player and application strings ([82f8320](https://github.com/Seenivers/App/commit/82f8320ebb6bb0114fdceaa7535c55c93ade5d87))
* **i18n:** add new localization keys for sorting and next episode functionality ([0d02ad5](https://github.com/Seenivers/App/commit/0d02ad54f4250c8c572d848ae235950e388360ce))
* **i18n:** extend the localization ([9fa9716](https://github.com/Seenivers/App/commit/9fa9716ecf4d27a81adbec6eb8e19e61cb8d38b7))
* **i18n:** implement localization for various components and update default locale structure ([1134b4b](https://github.com/Seenivers/App/commit/1134b4b62a33a3fc2b4e0e9c504da3e0da6220df))
* **i18n:** update German translations to English for improved clarity and consistency ([7881419](https://github.com/Seenivers/App/commit/788141993a6c69b030e6d1df362c99fb41c185fe))
* **i18n:** update translations and add new keys for improved localization ([ada84ee](https://github.com/Seenivers/App/commit/ada84ee580e0f290563033de834139b643142851))
* **layout:** add ProgressBar component for navigation feedback ([00e68bd](https://github.com/Seenivers/App/commit/00e68bdd6b2bfe6e8793b29f0e67073e1d50ad07))
* **progress-bar:** implement visibility control for navigation progress indicator ([553694b](https://github.com/Seenivers/App/commit/553694b0c18716dba3808a5cffff48b50c90c575))
* **svg:** add movie and tv SVG components ([21bcb37](https://github.com/Seenivers/App/commit/21bcb37c41ea1902b27da711ece12a330a4cf91c))

## [0.31.2](https://github.com/Seenivers/App/compare/v0.31.1...v0.31.2) (2025-05-03)

### Bug Fixes

- **episode, tv:** pass additional parameters to episode and series retrieval functions ([a20f23a](https://github.com/Seenivers/App/commit/a20f23a62f7c5fda0d98480e221416824560af1b))
- **episode:** remove unused external IDs and credits sections from episode details ([671ce30](https://github.com/Seenivers/App/commit/671ce3076785c77f6e64b9a7f78e8cda9ca59998))
- **episode:** update nextEpisode function to return URL and adjust navigation logic ([937ec73](https://github.com/Seenivers/App/commit/937ec73c8578b3bd994f616d76b4319ad3125183))
- **layout:** adjust main section padding and add margin for search input ([a320984](https://github.com/Seenivers/App/commit/a320984c8096876b122fc6e5b14c52616ee6d066))
- **print view:** hide elements in print view for Navbar, Toast, and main page ([20d00d9](https://github.com/Seenivers/App/commit/20d00d95bfeff2d5cb5f65031ef8c2369d869b9d))
- **season:** remove unused season page and related load function ([5b2a1d1](https://github.com/Seenivers/App/commit/5b2a1d197c6854740a45c238a1fa3d1cd3b7ba2d))
- **styles:** remove redundant active class styles from app.css ([a898cc8](https://github.com/Seenivers/App/commit/a898cc80bb4c84b136e169e921b4be6a6d011ded))
- **tv:** improve episode list styling and handle missing episode names ([bb7670c](https://github.com/Seenivers/App/commit/bb7670c21555c9dbd5cd6bb1efa282f37f083ab2))
- **tv:** update selectedSeason logic to retrieve the last unwatched season ([7f82523](https://github.com/Seenivers/App/commit/7f82523eeba0cf391d218643a59400374a161357))

## [0.31.1](https://github.com/Seenivers/App/compare/v0.31.0...v0.31.1) (2025-05-03)

### Bug Fixes

- correct condition for starting Discord RPC ([322a75d](https://github.com/Seenivers/App/commit/322a75dd489ea60f9de683f86f79627f8e533131))
- correct the path for the migration directory in the compile time ([1e2ccec](https://github.com/Seenivers/App/commit/1e2ccecc714ecae1eae9c145249fb5bb62899077))
- **deps:** update dependency @tauri-apps/plugin-updater to ^2.7.1 ([41c9a43](https://github.com/Seenivers/App/commit/41c9a434964257905e865fe81e6314048fc9ff83))
- **deps:** update dependency hls.js to ^1.6.2 ([37c5171](https://github.com/Seenivers/App/commit/37c517114ce5e97b3a0e3af5b125cb61b33e1c0d))
- **deps:** update rust crate tauri-plugin-drpc to 0.1.6 ([ce1dadd](https://github.com/Seenivers/App/commit/ce1dadd4c2704a4b66e774d0c2429c13533fc785))
- **deps:** update rust crate tauri-plugin-updater to 2.7.1 ([c28b299](https://github.com/Seenivers/App/commit/c28b2993a11dfe0ed8714b019f56b5bfbe12b434))
- **deps:** update tauri monorepo ([f3354a1](https://github.com/Seenivers/App/commit/f3354a18c3fff3bc7f6ce3ff4752acf8ff9d348c))
- **discord:** ensure Discord RPC stops when not active ([5a6a246](https://github.com/Seenivers/App/commit/5a6a246c43ead3917f176414015da1e4ed63cf93))
- **logging:** set log file name based on build type ([63608f0](https://github.com/Seenivers/App/commit/63608f09c4a8b93bffdb62b7bae21e0a517a4673))
- **settings:** restore settingsDB update on component destruction ([f4086a0](https://github.com/Seenivers/App/commit/f4086a05a0358da0b6c3f5a86ad1c8b372b2d510))
- update fetch-depth in checkout steps to 1 for better history access ([e839a9f](https://github.com/Seenivers/App/commit/e839a9f1a4e3c9045f24b6df6dc0926828cec349))

# [0.31.0](https://github.com/Seenivers/App/compare/v0.30.0...v0.31.0) (2025-04-17)

### Bug Fixes

- add IF NOT EXISTS clause to table and index creation statements in migration script ([5b5f67c](https://github.com/Seenivers/App/commit/5b5f67c4f6a161edf60f32ac11a9bb9433be32a2))
- correct syntax errors in SQL migration script for table creation ([687ecf5](https://github.com/Seenivers/App/commit/687ecf5b3fcbe3d55ea47adf69bf9e3734e8eeb6))
- disable filters for movies, series, and collections when no data is available ([3fbe3f2](https://github.com/Seenivers/App/commit/3fbe3f24dce5daec371e9e8ae150eada94b493aa))
- reload page after removing series path ([2b42702](https://github.com/Seenivers/App/commit/2b42702302c2f79696cf1d8892f134c25b9a33f7))
- Remove obsolete migration snapshots and journal files to clean up the database schema history. ([e29fae7](https://github.com/Seenivers/App/commit/e29fae7e247d07413937e4401460c390f7b7b530))
- remove unnecessary spaces in SQL migration scripts ([803c23f](https://github.com/Seenivers/App/commit/803c23fc7f25554ce8632a33244e2e2717607c3f))
- set status to "downloading" for new series and ensure ID uniqueness check ([397c486](https://github.com/Seenivers/App/commit/397c486d13d95108e8d4c378a08294a668757ca7))
- update badge text to improve user clarity ([e535d6d](https://github.com/Seenivers/App/commit/e535d6d262352833600aff826e2d552936e82a2c))
- update release name in Tauri workflow to 'Test v**VERSION**' ([66a9cb5](https://github.com/Seenivers/App/commit/66a9cb5e52fe3a6d776f11524b6d986fff86c91a))
- update removeElementById to use data.episodeID for correct path removal ([d15a5f6](https://github.com/Seenivers/App/commit/d15a5f6e735939c51b7e7f3980b0a75cedcb9cfa))

### Features

- add badge for episodes in collection when path is not null ([8be4636](https://github.com/Seenivers/App/commit/8be46364028f8975f127297e4a1a185d16276df8))
- add debug option to tauri build script ([e3766e8](https://github.com/Seenivers/App/commit/e3766e8d6268e371559e933db824c5b2d3b0e5c9))
- add GitHub Actions workflow for Tauri release on Windows ([4d200ea](https://github.com/Seenivers/App/commit/4d200ea5c650b340c0ae00b48172a2d6fa6f6513))
- add IF NOT EXISTS clause to new actors table creation ([04fdb89](https://github.com/Seenivers/App/commit/04fdb89d536dbcc0033761a792eedf229b556b57))
- add IF NOT EXISTS clause to table creation statements in migration scripts ([71ec45a](https://github.com/Seenivers/App/commit/71ec45a2bfc25ad72f58b9f2993fe8a4021551be))
- add include_dir dependency version 0.7.4 to Cargo.toml ([b6f0971](https://github.com/Seenivers/App/commit/b6f0971c6549ed9361584c33434feb15265b97cb))
- add initial migration files for database schema including tables and indexes ([cadc1ae](https://github.com/Seenivers/App/commit/cadc1ae2a1bbc131dd4e019c77cf34429a466bcb))
- add navigation to next episode and update load function to include nextEpisodeID ([ec67c6e](https://github.com/Seenivers/App/commit/ec67c6e7c0ed1b070af798740f5030cf9a20fb73))
- add tagName to Tauri release configuration for versioning ([9ec3177](https://github.com/Seenivers/App/commit/9ec3177ef6d5f77f5581b8abfe2d0e07afac736e))
- add Tauri configuration for Windows portable build ([c480681](https://github.com/Seenivers/App/commit/c480681c66bda3d07d1b4df89d902e213cdef257))
- add watched badge to episodes list and improve styling ([10846d5](https://github.com/Seenivers/App/commit/10846d5296c4ce58a6ebc4746a6b4c9f09166c61))
- ensure bundle is active in Tauri Windows configuration ([70e969b](https://github.com/Seenivers/App/commit/70e969b38ebadeb4263a41fafb83fcdbe14b815f))
- implement migration loading functionality for database ([d8b5592](https://github.com/Seenivers/App/commit/d8b5592b2176e8b047019cd022b00a6846738ff7))
- implement nextEpisode function to retrieve the ID of the next episode ([f0ec1d9](https://github.com/Seenivers/App/commit/f0ec1d99c87dca683e54aafc782556a63dbf4cbf))
- implement session storage for search criteria management ([82f1ad3](https://github.com/Seenivers/App/commit/82f1ad3ad6e81d40a85b4a1b231ef222f3802129))
- remove migration functionality from settings and layout components ([f60c7f4](https://github.com/Seenivers/App/commit/f60c7f49403786e2ed443e0cdcf50b0783f16770))
- remove migrations resource from Tauri configuration ([0a50fac](https://github.com/Seenivers/App/commit/0a50fac8c763075ecde0801f1e134f90b20a155d))
- remove obsolete Tauri Windows configuration file ([6c26a4b](https://github.com/Seenivers/App/commit/6c26a4bf73edf6e1380cc7c09c4a4694b38308c0))
- remove tagName from Tauri release configuration ([4a53268](https://github.com/Seenivers/App/commit/4a532686f3ca4d17c0896dca4111854233cc8fed))
- rename workflow and job for clarity in test release process ([70b7b6d](https://github.com/Seenivers/App/commit/70b7b6d19c0804be6b29d7bc1a065f0feb85c69b))
- serialize settings data in logging for better debugging ([74a5a32](https://github.com/Seenivers/App/commit/74a5a32922f69bb401159e77e884e87e6f22e3df))
- set database path dynamically based on build type ([6f5b38d](https://github.com/Seenivers/App/commit/6f5b38d2d1305faefed308a05f734c0be5ec8c5f))
- update add methods to check ID uniqueness before inserting or updating records ([d12b34b](https://github.com/Seenivers/App/commit/d12b34bafca8fa6173a87f024cdd217d4b46f9d5))
- update addNewSerie to handle missing entries by setting search status to "notFound" ([2f2f797](https://github.com/Seenivers/App/commit/2f2f797b3d5c8019d8d3a7a2447f8c989af21482))
- update addNewSerie to handle non-unique IDs by updating search status ([b9da11f](https://github.com/Seenivers/App/commit/b9da11feaa2aa7ee64199be7fdcb3f8f9f7a92b7))
- update navigation to next episode with state invalidation and enhance load function to depend on episode data ([c4f8b5b](https://github.com/Seenivers/App/commit/c4f8b5b206874b2a9a4ebf2d6f16859239c0cfe2))
- update pnpm version to 10 and remove unused signing keys from Tauri action ([e66e5c2](https://github.com/Seenivers/App/commit/e66e5c2ee6595cfb2165ba05b7e7e3b624d3069b))
- update release configuration for Tauri app with correct tagName and release details ([1f31771](https://github.com/Seenivers/App/commit/1f31771e56558f30907c0d5abbca394e647fe778))
- update release settings for Tauri Test Release to draft and non-prerelease ([e5e92bf](https://github.com/Seenivers/App/commit/e5e92bf78bc8c814144b5641992188397a4bece5))
- update Tauri configuration for Windows test release ([8fe11c2](https://github.com/Seenivers/App/commit/8fe11c28f5a5f2a25c372bbc804c55408d0b17b9))

# [0.30.0](https://github.com/Seenivers/App/compare/v0.29.0...v0.30.0) (2025-04-11)

### Bug Fixes

- add undefined checks for IDs in actor, collection, episode, movie, season, and serie retrieval functions ([1381928](https://github.com/Seenivers/App/commit/13819284ded1760abd23b671a18e84a9c3f2ef66))
- add watched filter to movies and series display ([c5aa1a8](https://github.com/Seenivers/App/commit/c5aa1a8ec5771be47a76fef6ea0cff9a48d110fd))
- **deps:** update dependency @tauri-apps/plugin-dialog to ^2.2.1 ([051ff9f](https://github.com/Seenivers/App/commit/051ff9f92364255c654f5e1a198476276469bf58))
- **deps:** update dependency @tauri-apps/plugin-fs to ^2.2.1 ([72019d1](https://github.com/Seenivers/App/commit/72019d118fb6fdc3e47359dd6c499b27f56dea4b))
- **deps:** update dependency @tauri-apps/plugin-process to ^2.2.1 ([4ea5b5f](https://github.com/Seenivers/App/commit/4ea5b5f13ab695a1af21420362425fda9d7268cf))
- **deps:** update dependency @tauri-apps/plugin-updater to ^2.7.0 ([008a781](https://github.com/Seenivers/App/commit/008a781ad3439e014f18feefeac9e11b804ec5b7))
- **deps:** update rust crate tauri-plugin-dialog to 2.2.1 ([c5c294d](https://github.com/Seenivers/App/commit/c5c294da2592c95aafcbad266b3dff702b4f4a17))
- **deps:** update rust crate tauri-plugin-fs to 2.2.1 ([7917306](https://github.com/Seenivers/App/commit/7917306fbdf84082e48970d99dc1fa6ae8883980))
- **deps:** update rust crate tauri-plugin-process to 2.2.1 ([3472839](https://github.com/Seenivers/App/commit/3472839fa56ca158eb34b18590108c7a792a3b94))
- **deps:** update rust crate tauri-plugin-updater to 2.7.0 ([f048089](https://github.com/Seenivers/App/commit/f048089a638cb3e15810156d68f8921046dbf9a3))
- **deps:** update tauri monorepo ([32f95d6](https://github.com/Seenivers/App/commit/32f95d6ffd0604aacb20667648ae98cea8c34cc1))
- enhance actor and movie data structure with additional fields ([94c4bff](https://github.com/Seenivers/App/commit/94c4bffaea37c155cc32be92841d2c57be9288ea))
- improve error handling and data retrieval for series, seasons, and episodes in load function ([8b2184f](https://github.com/Seenivers/App/commit/8b2184f670a86ef1dc1f2b993b40534d9e0c61a0))
- make seriesId and seasonNumber optional in getAll method parameters for episode, season, and serie ([5692d19](https://github.com/Seenivers/App/commit/5692d19d1fb229b1b01cddfe9195eaf81fcae9da))
- remove primary key constraint from id field in actors, collections, episode, movies, season, and serie tables ([00f18b1](https://github.com/Seenivers/App/commit/00f18b1dc82a0f94ed2d6b0153b8f01d2988fbb3))
- update button disabled state logic for season selection ([7d4c559](https://github.com/Seenivers/App/commit/7d4c55978c6a77e6f14a4d0313a1f4c541fe8c61))
- update condition to display main content when movies, collections, or series are available ([ef35fed](https://github.com/Seenivers/App/commit/ef35fed850d29695616cc904c0a24c60d1894c88))
- update episode insertion logic to use fetched ID instead of provided ID ([6b4c9ae](https://github.com/Seenivers/App/commit/6b4c9aecd81ce92ce444a1d5be6343750690d25e))
- update getAll method to handle optional items parameter and improve ID filtering ([74c6149](https://github.com/Seenivers/App/commit/74c6149f8b945fcb864c1b7c28ef0f49060dc511))
- update select logic in collection, episode, movie, season, and serie to return results instead of void ([e5bb036](https://github.com/Seenivers/App/commit/e5bb0361a8a6e15962faa6178649c90fa9d9a856))

### Features

- add delete button disable logic for development mode ([9e15972](https://github.com/Seenivers/App/commit/9e15972655456073ea1c681ea7da396ed2bab845))
- add newDB function for database backup and reload functionality ([93ab76f](https://github.com/Seenivers/App/commit/93ab76f9c8db0704f5020682c0c090c2cb9005c4))
- adjust sidebar styling for actor details page ([154ff2f](https://github.com/Seenivers/App/commit/154ff2f3c3e332618ce13d2ff9213af306a9ee3a))
- enhance getAll methods to support filtering by multiple IDs for actor, collection, episode, movie, season, and serie ([1fbab32](https://github.com/Seenivers/App/commit/1fbab32f4bae80b144bfa90d2f6ff2e301f09140))
- extend loadImages function to support Season and Episode types ([58e2ac7](https://github.com/Seenivers/App/commit/58e2ac7aeb599806422e9c493db58274998b7841))
- filter backups based on environment mode in validateBackups function ([a4c1693](https://github.com/Seenivers/App/commit/a4c1693bd349ccc2773a442831bedddb582ff99c))
- filter backups based on environment mode in validateBackups function ([aa3c8f9](https://github.com/Seenivers/App/commit/aa3c8f9622904ef529c88c18b04e214051ec5601))
- implement online fetching for actors, collections, episodes, movies, seasons, and series ([469d0bf](https://github.com/Seenivers/App/commit/469d0bf447fecb7f14e6f6d2a6659dbbba832965))
- improve backup management UI and function naming for clarity ([0f07481](https://github.com/Seenivers/App/commit/0f0748111f7832c1cd7700bf2968ffec1e6ab621))
- improve layout and styling of actor details page for better readability ([ce9ad7f](https://github.com/Seenivers/App/commit/ce9ad7f930c618f517e57ef059969af041d46bd2))
- refactor settings management into a separate component ([152164c](https://github.com/Seenivers/App/commit/152164c41e6f0239d33ccefee55b33a6d0db4483))
- update removal logic for episode, movie, season, and series to set path to null ([7799744](https://github.com/Seenivers/App/commit/7799744cb4abdd3aaaa59ee4af2c52cd236f69f4))
- update validateBackups function to create DB entries for unreferenced backup files ([dae9529](https://github.com/Seenivers/App/commit/dae95290b390c01bd1bb4c9cc9f242e0bcdb47f8))

# [0.29.0](https://github.com/Seenivers/App/compare/v0.28.0...v0.29.0) (2025-04-07)

### Bug Fixes

- remove redundant overview section from series details ([e51b63d](https://github.com/Seenivers/App/commit/e51b63db8b2258b7eb6be8f3e8825293d1e85065))

### Features

- add isFile utility function to validate file paths ([551db0f](https://github.com/Seenivers/App/commit/551db0f73b3e7f9b8acd276b5059ec9880a549a9))
- enhance movie display with watched and downloaded badges in collection view ([aef0c70](https://github.com/Seenivers/App/commit/aef0c7047a13d6f7b3e50e1caac92e1ef253eaf3))
- implement sorting functionality for movie collection with toggle option ([f111ce3](https://github.com/Seenivers/App/commit/f111ce3ebd987afe56192029ca09efe5afb84ab1))
- improve file validation in addNewFiles function and enhance isFile utility ([cd0ace2](https://github.com/Seenivers/App/commit/cd0ace2c39ca0abfb46a7a3306b7359b717c812d))
- refactor fetchData and parseResponse functions for improved error handling and parameter management ([f505343](https://github.com/Seenivers/App/commit/f505343c0adfbd3daa6e208ec244471e5884dd82))
- update addSeasonToDatabase to accept season details and process each season correctly ([911ddfa](https://github.com/Seenivers/App/commit/911ddfaffd23095b9486ea36f0b7ae2059c18d0a))

# [0.28.0](https://github.com/Seenivers/App/compare/v0.27.0...v0.28.0) (2025-04-06)

### Bug Fixes

- add YouTube trailer check for online series data ([e9b5bf1](https://github.com/Seenivers/App/commit/e9b5bf16d3d1cff5f887d90166a8b4da39d0d06c))
- correct browser check in layout load function ([5da425d](https://github.com/Seenivers/App/commit/5da425d4439fced1cb8e0a4b71d75bc6f2595124))
- **dependencies:** remove outdated node_modules and regenerate package-lock.json ([33454a9](https://github.com/Seenivers/App/commit/33454a94362de33acf34792f94220f4450913606))
- **deps:** update dependency @tauri-apps/plugin-log to ^2.3.1 ([7213320](https://github.com/Seenivers/App/commit/72133207fedb1b5fa1b48fab82b1782239fe6cb9))
- **deps:** update dependency better-sqlite3 to ^11.9.1 ([fde363f](https://github.com/Seenivers/App/commit/fde363f3ee969d8a0ffec5570b8f9644df413d16))
- **deps:** update dependency drizzle-orm to ^0.41.0 ([623d52e](https://github.com/Seenivers/App/commit/623d52efc00ff1253f4793c83fdc3ea7cd283adf))
- **deps:** update dependency hls.js to ^1.6.0 ([42b97a3](https://github.com/Seenivers/App/commit/42b97a35472273f9f044b3d72d8643cdfa0a88b3))
- **deps:** update tauri monorepo ([9734698](https://github.com/Seenivers/App/commit/9734698ba348c0d0fe0651116f68b6c493f58a32))
- enhance default settings creation with retry logic and migration fallback ([06f3ab1](https://github.com/Seenivers/App/commit/06f3ab1ec1bd5982935b9c0b6b3ca72c4e60c1ba))
- ensure tmdb property is defined in isMovieEntry function ([b777fb3](https://github.com/Seenivers/App/commit/b777fb3582090adca5f968ed0bf04fd6ebe49429))
- handle missing backdrop image and provide default overview text ([e578cf5](https://github.com/Seenivers/App/commit/e578cf5d0ac23e719a3412e41c325368d28349ca))
- **settings:** enforce not null constraint on keywords and ignoredKeywords fields ([e101736](https://github.com/Seenivers/App/commit/e101736b84d381ec9c021a939359294fbfda886a))
- **settings:** simplify unsaved changes confirmation logic ([f40f35b](https://github.com/Seenivers/App/commit/f40f35b3a3ed5613db31dd7e3faacc16174e2dde))
- update condition to check for non-empty movie, collection, and series data ([5803745](https://github.com/Seenivers/App/commit/5803745e12d3ad03b539f7d94438755e53ec2986))
- **vscode:** remove duplicate Svelte extension recommendation ([85e9b2f](https://github.com/Seenivers/App/commit/85e9b2fe9879dd18153923368d31dc28692de7c8))

### Features

- add card component with dynamic scaling and image support ([a00e9cd](https://github.com/Seenivers/App/commit/a00e9cdda06a282d80aeed0973c40063cad7b2b4))
- add genre extraction and return genres in load function ([9bbca2b](https://github.com/Seenivers/App/commit/9bbca2b818fc4ca450634f63b870f5990d290ec0))
- add link to open collection on TMDB ([2aedd38](https://github.com/Seenivers/App/commit/2aedd381fa34444a795c42dc195bcd327728978e))
- add placeholders for TMDB titles to movies with path ([b9f9943](https://github.com/Seenivers/App/commit/b9f9943460ffcc3e54c23b6804989c9fe03e1e52))
- add search SVG icon component ([044d2b8](https://github.com/Seenivers/App/commit/044d2b84fd1feee8e0be1227a49ca7e4a3c4d2c2))
- add watched badge to movie card component ([c859835](https://github.com/Seenivers/App/commit/c859835af66d8626df8af037b1a2216e8dc1c9d4))
- add watched property to movie and TV card components ([7fee49b](https://github.com/Seenivers/App/commit/7fee49b4607a933e58b8f2a1725257b4b67c5ed4))
- enhance user experience by adding a link to add movies when none are added ([f5d8177](https://github.com/Seenivers/App/commit/f5d8177f346124687b913be5639233c365e45296))
- implement genre filtering and sorting options for movies, series, and collections ([2f15c6a](https://github.com/Seenivers/App/commit/2f15c6a15844facbb34c284741cb47f5f5d07fe1))
- implement isMovieEntry utility function and refactor movie filtering logic ([b5767a5](https://github.com/Seenivers/App/commit/b5767a587fcf6aec1fbdbfd52e93825815819204))
- implement search functionality for collections, movies, and series ([ca094a7](https://github.com/Seenivers/App/commit/ca094a7deb09806b8a5324baeeec1615d19d319e))
- **layout:** update settings in database on app close ([d3f840a](https://github.com/Seenivers/App/commit/d3f840a953cdeaf58604c758c7036da513517c26))
- optimize card component scaling logic for improved readability and maintainability ([08288b9](https://github.com/Seenivers/App/commit/08288b9f7c529df2b8129fa9e48cba3b1bbede50))
- optimize data retrieval and filtering for movies, series, and collections ([a09ff6c](https://github.com/Seenivers/App/commit/a09ff6c9b8e7966951eb4466f7bbbdaf32d83aca))
- refactor card scaling logic and introduce scaleClasses utility ([b47ed0c](https://github.com/Seenivers/App/commit/b47ed0c594c998c10af00f936d8eae03dfb1ac9f))
- refactor movie display logic and improve search functionality ([bcde742](https://github.com/Seenivers/App/commit/bcde7420d6c3d3292c15d4f90983df163388f851))
- replace anchor elements with Card component for improved UI consistency ([5709d2d](https://github.com/Seenivers/App/commit/5709d2d9c21fcd66811a8b42f12025e758a480f4))
- replace inline search SVG with reusable Search component ([3bd960d](https://github.com/Seenivers/App/commit/3bd960dd429c909f8c46aa225693e1bdaa0d4838))
- **settings:** implement default settings creation and retrieval logic ([82d9ec5](https://github.com/Seenivers/App/commit/82d9ec56aa307ee6e8e8f28982e819ac1c816058))
- **settings:** initialize settings state from database ([908698a](https://github.com/Seenivers/App/commit/908698aae8e154d1b9a8431eb5c84ae091b8fba4))
- **settings:** refactor settings handling with temporary state for improved user experience ([f141dda](https://github.com/Seenivers/App/commit/f141dda9733aa0d38e35dd6096ad0e82df3dcb50))
- **tv:** implement async image loading for backdrop and enhance layout ([25dfdf1](https://github.com/Seenivers/App/commit/25dfdf1ac5f48e6686075b31259818d48af55668))
- update button styling for grid/list view toggle ([bb51680](https://github.com/Seenivers/App/commit/bb51680424267d98a2a9fe865c9bb58f4ee01696))
- update search input styling and SVG icon for improved UI ([87ecfde](https://github.com/Seenivers/App/commit/87ecfde97c9b616d6d7ee8ca7bea6adc86f380bb))

# [0.27.0](https://github.com/Seenivers/App/compare/v0.26.1...v0.27.0) (2025-03-30)

### Bug Fixes

- **deps:** update dependency @tauri-apps/plugin-updater to ^2.6.1 ([8e5056f](https://github.com/Seenivers/App/commit/8e5056f5122084fa61d13d4f3e6613378a78dcd3))
- **deps:** update rust crate tauri-plugin-log to 2.3.1 ([a72060a](https://github.com/Seenivers/App/commit/a72060ae257a3555ab01f5dc6536f10d492c7f2e))
- update copyright notice from Seenivers.net to Seenivers.com ([26554be](https://github.com/Seenivers/App/commit/26554be3d432f7ac7b728994f2fe061d86301072))

### Features

- **updater:** enhance update handling with download progress tracking and improved UI ([f7740f4](https://github.com/Seenivers/App/commit/f7740f47eac950d98e977c3c76123aac9fa892fc))

## [0.26.1](https://github.com/Seenivers/App/compare/v0.26.0...v0.26.1) (2025-03-29)

### Bug Fixes

- **tv:** update condition to check for empty movies, collections, and series ([7ec363a](https://github.com/Seenivers/App/commit/7ec363a9616e3d6409d4e7265378292ecc83a434))

# [0.26.0](https://github.com/Seenivers/App/compare/v0.25.0...v0.26.0) (2025-03-29)

### Bug Fixes

- await movie.add() to ensure proper asynchronous handling when saving movie to database ([ad91e2c](https://github.com/Seenivers/App/commit/ad91e2c1167614f5c58e932f124665610904d374))
- await serie.add() to ensure proper asynchronous handling when saving series to database ([ea16961](https://github.com/Seenivers/App/commit/ea16961e8aca239f9903e3bbf2d1cb5b73be8f16))
- correct season and episode indexing in addNewSerie and addSeasonToDatabase functions ([5803344](https://github.com/Seenivers/App/commit/5803344137ca05aa9f736c544e539878d70517da))
- **deps:** update rust crate serde to 1.0.219 ([bcd024d](https://github.com/Seenivers/App/commit/bcd024d88e7d46ca08c894eb62c49bf6cf7eb812))
- **deps:** update rust crate serde_json to 1.0.140 ([2c04f71](https://github.com/Seenivers/App/commit/2c04f7149efd86a630641547e51abcfaac275381))
- **deps:** update rust crate tauri-plugin-updater to 2.6.1 ([03cdec6](https://github.com/Seenivers/App/commit/03cdec68cddb6d136a0509bad12af07d4c204c69))
- enhance update functions for episode, season, and serie to handle empty updates and improve error logging ([78aae90](https://github.com/Seenivers/App/commit/78aae90a38855ab12c5b1b58d06254bacfb4bc1e))
- enhance updateMovie function to handle empty updates and improve error handling ([bc724d1](https://github.com/Seenivers/App/commit/bc724d1d0dc9a43789f9c9fa3e1f558f1ea3d46f))
- ensure movie data is re-fetched if not found locally ([a73f025](https://github.com/Seenivers/App/commit/a73f025cea16c621c88fef4dbb34d95a9b65c9bc))
- **episode:** update trailer display logic to ensure path existence check before showing trailers ([2e5ab33](https://github.com/Seenivers/App/commit/2e5ab33e3357c25125748b9028a94d3a7610af72))
- improve entry validation in addNewMovies function ([9ca2d0a](https://github.com/Seenivers/App/commit/9ca2d0aab38ffe5d61e6b26866a50fb09bbbe18d))
- improve input handling by simplifying null check for keywords ([cfa55a8](https://github.com/Seenivers/App/commit/cfa55a8ec95708d34951812b2e344047b6bda098))
- **movie:** improve layout and structure of movie details page for better readability ([58be92a](https://github.com/Seenivers/App/commit/58be92a4719b43ec8e7eba3fb962cca200e15714))
- optimize collection loading by removing unnecessary updated timestamp ([92dabac](https://github.com/Seenivers/App/commit/92dabacf6024d500125b8f00f7935bfcf6dc12f9))
- optimize layout and structure of episode, movie, season, and TV pages for improved readability ([a36075e](https://github.com/Seenivers/App/commit/a36075e5348a5fbc975a1da3f8f2760ab1cbd39b))
- **page:** simplify href construction for movie and TV links ([a0b777f](https://github.com/Seenivers/App/commit/a0b777f3035ab2e1a9a18190e81c4390eb406626))
- refactor movie loading logic to streamline database storage process ([65cdf5b](https://github.com/Seenivers/App/commit/65cdf5b73a6bcf8ba08918f9d4c9722944a30e7c))
- remove duplicate keywords in settings input handling ([4984b56](https://github.com/Seenivers/App/commit/4984b56979c54855dc08ec331b97a78aaffee8ce))
- remove includeAdult option from SearchOptions interface ([7e1086c](https://github.com/Seenivers/App/commit/7e1086c6d1f9f1cd4de691af3ecccde7803e4672))
- remove unnecessary console log from season page load function ([99084cb](https://github.com/Seenivers/App/commit/99084cb0a4de5bd15c17966bb2b885a06fc8b5d6))
- remove unnecessary series ID uniqueness check in addNewMovies function ([c761dfd](https://github.com/Seenivers/App/commit/c761dfd7f167c5658a38b6a7f6082c494b44cbce))
- remove unnecessary updated timestamp from database entries ([92a9366](https://github.com/Seenivers/App/commit/92a93663b4dc160942ba70899e14bc31d84d1357))
- remove unused imports from episode, season, and tv page components ([1d1db2e](https://github.com/Seenivers/App/commit/1d1db2ea5b8322ca2dd6ecc72bd4f09fb390dce2))
- rename addEpisodesToDatabase function to addSeasonToDatabase for clarity ([c173da0](https://github.com/Seenivers/App/commit/c173da0146eac2e393ed3144566d8ec724c692df))
- rename addNewFilesToStatus to addNewPathsToStatus for consistency ([d74d7dc](https://github.com/Seenivers/App/commit/d74d7dca5e3c6f3b99c634972233a497a503d8eb))
- rename isPathUnique to isMoviePathUnique for clarity ([4ee7241](https://github.com/Seenivers/App/commit/4ee7241cf7a0d9397902b90434f99c81b09c1710))
- replace addNewFilesToStatus with addNewFiles in selectTvFolder function ([7a42686](https://github.com/Seenivers/App/commit/7a426863f4be8a7d1938aa2c3274d6d4a8bc0e62))
- **season:** update header from 'Serienbesetzung' to 'Staffelbesetzung' for improved localization ([0ab0f1e](https://github.com/Seenivers/App/commit/0ab0f1e38501dba4f1546227165e5484892dcc8f))
- **settings:** enhance language option display with localized names ([96be5f9](https://github.com/Seenivers/App/commit/96be5f9caee06705f866a505b3e532e2a41e844c))
- **settings:** improve layout and localization of settings page components ([0578c54](https://github.com/Seenivers/App/commit/0578c54632cdda3e47241d674ee3be62cb94af0b))
- simplify filtering of wait entries in add page ([682cb06](https://github.com/Seenivers/App/commit/682cb06f3d85c1e205426e3934b2f8a4fc7c83db))
- **tv:** improve layout and structure of season and episode sections for better readability ([f7154a5](https://github.com/Seenivers/App/commit/f7154a5b04bcf52154eaaef11b08173dd3a941dc))
- **tv:** improve layout and structure of TV series and seasons sections for better readability ([21c76ec](https://github.com/Seenivers/App/commit/21c76ec2f84ce5cefc4ef93fd79a7d6f196c7481))
- **tv:** optimize image handling for season posters to enhance loading performance ([70cac5d](https://github.com/Seenivers/App/commit/70cac5dec2c3f938f723f4b13cce609839580d97))
- update addNewFiles function to handle both movies and series ([dd5a716](https://github.com/Seenivers/App/commit/dd5a716eefbf3f724a895da1796780f0f090f839))
- update default timestamp to current date for database schema ([fd3bd35](https://github.com/Seenivers/App/commit/fd3bd35e1a376bfb12e33776097c9a6e2e6c3beb))
- update episode link to use correct route for episode details ([408ac63](https://github.com/Seenivers/App/commit/408ac632a1c6be38f069b9d6dac31bf5ce2dce7b))
- update error message for missing series in load function ([05237fc](https://github.com/Seenivers/App/commit/05237fc901123598b526aee23cd2bbf02074fd15))
- update error messages and variable names for season data retrieval ([a9b38eb](https://github.com/Seenivers/App/commit/a9b38eb99c83994e9b49ecebab14693692fb1e2a))
- update load function to directly add new files from data.paths ([8b86bbf](https://github.com/Seenivers/App/commit/8b86bbf6b0b200c7c66cf8e6ad3035bdfb5c5c97))
- update loadImages function to accept both Movie and Serie types ([b236029](https://github.com/Seenivers/App/commit/b2360296570bbfe5a557af48b95485b91998bd91))
- update parameter names for clarity in addNewFiles functions ([3043c2e](https://github.com/Seenivers/App/commit/3043c2ef70111e4c608bc18f8768e52e39c5c5cc))
- update query parameter name from 'seasonNumber' to 'seasonID' in parseSeasonId function ([cd29bd8](https://github.com/Seenivers/App/commit/cd29bd82deb507e16255b243f9fe659cb6645b6e))
- update return types in getSerie, getSerieSeason, and getSerieSeasonEpisode functions ([a0b2a67](https://github.com/Seenivers/App/commit/a0b2a672ff2eb1748d827a809865cb22e61f3f99))
- update season link to include tvShowID for proper routing ([1253d70](https://github.com/Seenivers/App/commit/1253d70057c612daffcf88c7128f8b6ab4c37c40))
- update season link to use season_number for proper routing ([35b4af8](https://github.com/Seenivers/App/commit/35b4af873d5c8246c74d18892b44d6ed7176d9fc))
- use isSeriePathUnique for series path uniqueness check in filterNewFiles ([9da41ca](https://github.com/Seenivers/App/commit/9da41ca499d23e0a401e90e48346088d4f78347e))

### Features

- add isSerieIDUnique function to check for unique series ID in the database ([7e8def4](https://github.com/Seenivers/App/commit/7e8def46640e1cc8549a0329ec6f855b896cf06a))
- add isSeriePathUnique function to check for unique series paths ([91fa560](https://github.com/Seenivers/App/commit/91fa5606009056beaa8a7ec8dd195405c69f5900))
- add media type to Plyr and Vidstack components for movie playback ([a708c76](https://github.com/Seenivers/App/commit/a708c76dd840f765788cf8271369c291a7f0fa5f))
- add parseEpisodeId function to retrieve and validate episode ID from URL ([aff268b](https://github.com/Seenivers/App/commit/aff268b83c06f2fa845bf0e4b16bb66ced47f87d))
- add parseSeasonId function to retrieve and validate season ID from URL ([e9c80d3](https://github.com/Seenivers/App/commit/e9c80d3d9dc2974c070e859f635644f1689daea7))
- add parseSeasonNumber function to retrieve and validate season number from URL ([116e598](https://github.com/Seenivers/App/commit/116e5988a165f73a0db6efd11e536d30cf4f57fa))
- add parseSerieId function to extract and validate tvShowID from URL ([a19e9df](https://github.com/Seenivers/App/commit/a19e9df0137b7c9bd022b8904119b18245296346))
- add seasonID and episodeID to URLs for improved routing and data retrieval ([5e925f5](https://github.com/Seenivers/App/commit/5e925f5f2ea17e83142a8de9ce85aef7b00f8030))
- add selectTvFolder function to enable TV folder selection in the add page ([474b029](https://github.com/Seenivers/App/commit/474b0299bfcf6d9fd3aca66b9e9d8deb179b8f83))
- add support for media types to video utilities and player components ([3bf31e0](https://github.com/Seenivers/App/commit/3bf31e0d07bcc66e41e22c3752c0401e6f8c279b))
- add TV series page with functionality to toggle watched status, remove series, and open file path ([e1de1d8](https://github.com/Seenivers/App/commit/e1de1d860db6b8a9a0c41a69beb6ea06465e0e9f))
- allow selection of multiple TV folders in selectTvFolder function ([3aa46f6](https://github.com/Seenivers/App/commit/3aa46f63625cfa3e6ce5c20b14815e4dc6e5dcf6))
- **discord:** add isRunning check for Discord activity status ([6b6d14f](https://github.com/Seenivers/App/commit/6b6d14f900a77d3ad4163dc9cd5d21bd35c5ce24))
- enhance addNewMovies function to check for unique series ID ([dd22482](https://github.com/Seenivers/App/commit/dd2248246aeb06fe0c84dc5febea8f556711d3e3))
- enhance load function to handle TV series separately in movieIds processing ([ce43e97](https://github.com/Seenivers/App/commit/ce43e97064b53a933518108a5b23537dea099bd5))
- **episode:** add episode page ([6c3d30f](https://github.com/Seenivers/App/commit/6c3d30f2095603eee256b2ccc2e676c6f269bcf8))
- **episode:** improve episode details display with enhanced localization and additional information ([37c3f4b](https://github.com/Seenivers/App/commit/37c3f4bbbdcd3e028fc71ddda089102c11675891))
- export MediaType type for broader accessibility ([f6acb75](https://github.com/Seenivers/App/commit/f6acb75553426d86906e0517fa60bcc8185dad11))
- **filter:** implement isMovie function for movie type checking ([56f80c5](https://github.com/Seenivers/App/commit/56f80c5e625f9693f990226f097badfa62c21419))
- implement actor utility functions for database operations ([0fc5917](https://github.com/Seenivers/App/commit/0fc59178e2aa1b842842c761e24ffd4e4f4c0831))
- implement addEpisodesToDatabase function to add seasons for a serie ([7f669d2](https://github.com/Seenivers/App/commit/7f669d2d98505c7cb60336fa70f20c76e46acf4a))
- implement addEpisodeToDatabase function to add episodes for a season ([8189984](https://github.com/Seenivers/App/commit/8189984fbcb91a290d5a84097b94040cf43262ab))
- implement addNewSerie function for adding series to the database ([5fd8474](https://github.com/Seenivers/App/commit/5fd8474c9e45ec3f3be03f5217ec475c1841833e))
- implement collection management functions for adding, retrieving, updating, and deleting collections ([3011cf1](https://github.com/Seenivers/App/commit/3011cf167078a7c3d060a993d31ed8c471e86237))
- implement episode utility functions for CRUD operations and uniqueness checks ([3f02384](https://github.com/Seenivers/App/commit/3f02384799444fe7c5db6d4e3831bb742784ce02))
- implement function to find seasons and episodes from directory structure ([18225d4](https://github.com/Seenivers/App/commit/18225d4c8697a1a74a760680fc5d2d36860c6036))
- implement getSerie function to retrieve series from the database ([851a248](https://github.com/Seenivers/App/commit/851a248af1c516769409e0acc76f1b1d75a1e649))
- implement load function to manage file loading and searching process ([ab71f81](https://github.com/Seenivers/App/commit/ab71f819b18dbacce943539abcf84925c2d243f9))
- implement movie management functions for adding, retrieving, updating, and deleting movies ([1594eff](https://github.com/Seenivers/App/commit/1594eff88ed45584f480163629f4f4dc947429fc))
- implement season page with data loading and management functions ([d4b1df7](https://github.com/Seenivers/App/commit/d4b1df7d0b0f7da169016fdbe9e5523ba68b413b))
- implement season utility functions for CRUD operations and uniqueness checks ([53001a2](https://github.com/Seenivers/App/commit/53001a2ec73624c304f8a973928d6b59176a5ac2))
- implement serie utility functions for CRUD operations and uniqueness checks ([05684a0](https://github.com/Seenivers/App/commit/05684a06e660a44455dc3554612603b035442bc6))
- implement series retrieval logic with local and TMDB fallback ([fa9d170](https://github.com/Seenivers/App/commit/fa9d17018e8ee6b6dc09f5ccc38573c14156c1b2))
- **links:** update TMDB links to include season and episode details ([2061380](https://github.com/Seenivers/App/commit/20613800f8ad3b648743fe69d0975c7dbe6ec4d2))
- **page:** enhance movie and series handling in page load ([df33310](https://github.com/Seenivers/App/commit/df33310e4d82a3e5dae0405c1985731a26f99905))
- **season:** enhance season details display with additional information and improved localization ([f921bac](https://github.com/Seenivers/App/commit/f921bac9064a52dd327a4fefb1567c9a57c7a1e1))
- streamline addNewSerie function by integrating episode addition and image loading ([dd40742](https://github.com/Seenivers/App/commit/dd40742cd8b3ae4708c0d7f54f90d3411b5aa283))
- **trailer:** add online check before displaying trailers in episode, movie, season, and tv pages ([490ae89](https://github.com/Seenivers/App/commit/490ae898fd0fd1b22c72dadfb784ef88c72628f8))
- **trailer:** update trailer display logic to check for path existence before showing trailers ([881c636](https://github.com/Seenivers/App/commit/881c636d060fda622aece386acc0b17569b4ee35))
- **tv:** update TV details display with additional information and improved formatting ([8da4be0](https://github.com/Seenivers/App/commit/8da4be0f6ac748772cadd1703f01e9f5322d748a))
- update addSeasonToDatabase and addEpisodeToDatabase functions to handle season and episode paths ([e6b109e](https://github.com/Seenivers/App/commit/e6b109e979bc110afd8033174c5ebfcea9d70272))
- update movie path during addition of new movies for better tracking ([8bcecac](https://github.com/Seenivers/App/commit/8bcecac903d41727e5111000289ce89c30f0fdc0))

# [0.25.0](https://github.com/Seenivers/App/compare/v0.24.1...v0.25.0) (2025-03-07)

### Bug Fixes

- **backup:** close DB connection and reload app after restore ([6248a90](https://github.com/Seenivers/App/commit/6248a906ead90704bc5cf5474b3a95ade8d05607))
- **backup:** ensure backup validation returns a boolean value ([a735e8d](https://github.com/Seenivers/App/commit/a735e8d56c38a24ac46f64cecc86c2f28927f09f))
- **backup:** rename restoreBackup to validateBackup and update button functionality ([c5a4499](https://github.com/Seenivers/App/commit/c5a4499c0cac3fbf344e150c4ec95deddfa4fa31))
- **backup:** replace 'on:click' with 'onclick' for backup button event handling ([bc1f0be](https://github.com/Seenivers/App/commit/bc1f0be1d057220b06131f37f807c08eb9882e77))
- **backup:** update get method to retrieve backup by ID ([0c9fb8d](https://github.com/Seenivers/App/commit/0c9fb8d82b64018398877722b16f85aa015ca56a))
- **backup:** use platform-specific path separator in extractFileName function ([8cca32c](https://github.com/Seenivers/App/commit/8cca32c404466d69be1374c12dce03c4d0c90f81))
- **backup:** validate backups before restoring and move backup files instead of copying ([884db6e](https://github.com/Seenivers/App/commit/884db6e4521a47b825fc82350760e2dad8a5d4c6))
- correct typo in destroy function import from tauri-plugin-drpc ([76a4d5e](https://github.com/Seenivers/App/commit/76a4d5eeaef192e191f5ac291b5ecf0309dbf2db))
- **deps:** update dependency @tauri-apps/plugin-log to ^2.2.3 ([692496e](https://github.com/Seenivers/App/commit/692496eab4f09c1bb19a14f36438ae69e7f52797))
- **deps:** update dependency @tauri-apps/plugin-opener to ^2.2.6 ([8045363](https://github.com/Seenivers/App/commit/80453635e7fa9504c285c42d7ac1ef742882ba5d))
- **deps:** update dependency @tauri-apps/plugin-updater to ^2.5.1 ([a8dc53a](https://github.com/Seenivers/App/commit/a8dc53a64d061635daf65c62a7bef1a57ca96e2c))
- **deps:** update dependency tauri-plugin-drpc to ^1.0.3 ([64e1e32](https://github.com/Seenivers/App/commit/64e1e320d4fd91dda600cbc85e4319e57b0e105d))
- **deps:** update rust crate serde to 1.0.218 ([edfd407](https://github.com/Seenivers/App/commit/edfd407dee50a7f9822547f265be24b5a07976c7))
- **deps:** update rust crate tauri-plugin-drpc to 0.1.4 ([d08095c](https://github.com/Seenivers/App/commit/d08095cb8310fb01d5352f10e68ff6000bab04ab))
- **deps:** update rust crate tauri-plugin-log to 2.2.3 ([898b86f](https://github.com/Seenivers/App/commit/898b86f40f1fe0d05e7ebcc89ebc9820a6d37aad))
- **deps:** update rust crate tauri-plugin-opener to 2.2.6 ([7f22b57](https://github.com/Seenivers/App/commit/7f22b57cf49675b1af57bad35628e2042e2cb3e3))
- **deps:** update rust crate tauri-plugin-updater to 2.5.1 ([c478159](https://github.com/Seenivers/App/commit/c47815921971bd7cbe23962871245b817da01b20))
- **deps:** update tauri monorepo ([3ea4923](https://github.com/Seenivers/App/commit/3ea492353bb0ab4c4d09bb422af08715c1ac7f52))

### Features

- **backup:** add backup validation button to the backup settings ([41437f1](https://github.com/Seenivers/App/commit/41437f1b7ecc1e4693e5bcffef0ebab735637d02))
- **backup:** implement backup management interface with create, restore, and delete functionalities ([6ea9130](https://github.com/Seenivers/App/commit/6ea91306f1d7f53325d7541345861aa863574c0b))
- **backup:** implement backup validation to clean up missing or unused entries ([8d20553](https://github.com/Seenivers/App/commit/8d205534e65bc523f4b09b4638d0ea7c818f3b1d))
- **backup:** implement delete functionality for backups ([55e8c04](https://github.com/Seenivers/App/commit/55e8c04991f1962ac3035ff64f6abe83ce974fc1))
- **backup:** implement restore functionality for backups ([cf8b16e](https://github.com/Seenivers/App/commit/cf8b16e642a62169a85bd8d81762941a47e262d0))
- **settings:** add backup tab to settings page ([fa5fac5](https://github.com/Seenivers/App/commit/fa5fac57b5fcc4ae81c1a029df4067a421926a0a))

## [0.24.1](https://github.com/Seenivers/App/compare/v0.24.0...v0.24.1) (2025-03-01)

### Bug Fixes

- **backup:** adjust backup file naming for development environment ([0fa171c](https://github.com/Seenivers/App/commit/0fa171cd921c2aab9a5bc337477552882fdaf49b))

# [0.24.0](https://github.com/Seenivers/App/compare/v0.23.0...v0.24.0) (2025-03-01)

### Bug Fixes

- **add:** comment out button for selecting TV folder ([a69a9be](https://github.com/Seenivers/App/commit/a69a9be9cfe2bcaa2a14eb8d851c6faf73bee181))
- **add:** handle potential null settings.keywords in file name cleanup ([1bc1415](https://github.com/Seenivers/App/commit/1bc141515d55cec7ad02c0ed9d54f1a85a1809e0))
- **backup:** remove trailing hyphen from development database filename ([8650d4c](https://github.com/Seenivers/App/commit/8650d4cfc42791279bd648cbcd77502d6486d97e))
- change Date types to string for TV show data structure ([78ed626](https://github.com/Seenivers/App/commit/78ed6266c23ca0b2131bcdb962c232c059342b0e))
- **deps:** update dependency tauri-plugin-drpc to ^1.0.2 ([cacb814](https://github.com/Seenivers/App/commit/cacb81494025bb3f9d27d40d50332a0bb57beff2))
- **deps:** update dependency vidstack to ^1.12.13 ([a4cdd60](https://github.com/Seenivers/App/commit/a4cdd6041cdb24b64bcf94a964d23e11164cd0e2))
- **settings:** update handleInput function to support multiple input types for keywords ([ecf8285](https://github.com/Seenivers/App/commit/ecf8285b610cb215f3a3b39752dc00810a997833))
- **types:** add ISO3166_1 type to tv.ts for improved country code handling ([d9c74c4](https://github.com/Seenivers/App/commit/d9c74c471180ce44d103535c2c9b8dad65292ef9))
- **types:** update tmdb type in episode schema to use Episode type ([9bc4f0d](https://github.com/Seenivers/App/commit/9bc4f0dfd431e9f0488fa2fd614213a7f171b5ac))
- **types:** update tmdb type in season schema to use Season type ([d9e986b](https://github.com/Seenivers/App/commit/d9e986b01285537c54d124d08ec34542434be2b7))
- **types:** update type declarations in tv.ts for consistency ([9a7c42f](https://github.com/Seenivers/App/commit/9a7c42fc7860c515763d665ef2b885d8f1c908db))

### Features

- add 'discordAktiv' setting to manage Discord RPC activation ([1c80b07](https://github.com/Seenivers/App/commit/1c80b078fd6283b3093d9f6bdc86d01f9ff11369))
- add button to select TV show folder in add page ([541716c](https://github.com/Seenivers/App/commit/541716cd0dc4053a0afba7027b0f54692c55f277))
- add episode schema to database with relevant fields ([18b844f](https://github.com/Seenivers/App/commit/18b844fe8b6ee8191f4e5f913ce60f6ec6b76462))
- add function to search for TV programs in the TMDB ([49fee00](https://github.com/Seenivers/App/commit/49fee00d27c22a79687fac755ec1b73cffd2aff5))
- add ignoredKeywords and theme properties to Settings interface ([3beb73c](https://github.com/Seenivers/App/commit/3beb73c566b9020abb916ace3a89bd7d049f988b))
- add ignoredKeywords property to settings schema and implement UI for keyword input ([1c9d40b](https://github.com/Seenivers/App/commit/1c9d40b92e2332ec9e6ef8448fa35e5722218ae7))
- add light and dark themes to daisyUI configuration ([99bc628](https://github.com/Seenivers/App/commit/99bc628569069d66341165380afa0b4b0004f14e))
- add mediaType to SearchList for distinguishing between movies and TV shows ([3758e95](https://github.com/Seenivers/App/commit/3758e95cbefd3ef6a0b45aace857f172daadb3be))
- add OldData interface and related OldMovie structure to types.ts ([171227a](https://github.com/Seenivers/App/commit/171227a0f8fb7133095f56633bb3ab4cd8acca52))
- add schema for series in the database ([697201f](https://github.com/Seenivers/App/commit/697201f52f7d4b0d483337095c2960f86f7a29b7))
- add season schema to database with relevant fields ([6dce9f2](https://github.com/Seenivers/App/commit/6dce9f2ecd92dadae3ef79268bad18a9afb0a27e))
- add selectTvFolder function for selecting TV show directories ([1a09a15](https://github.com/Seenivers/App/commit/1a09a158acdc7b49609225308a1528ec6350faf5))
- add serie, season, and episode to the database schema exports ([ec5b32e](https://github.com/Seenivers/App/commit/ec5b32e6f0b99818a852af94ab42865d59454cd9))
- add theme property to settings schema and implement theme selection in settings page ([98b55a6](https://github.com/Seenivers/App/commit/98b55a622bc405e1ea16d3d86a534af51937f9ec))
- add themes array to support multiple UI themes ([ff1c441](https://github.com/Seenivers/App/commit/ff1c441482cb39dc35cc64d2c03124e4a77c6c7b))
- add TV interface to searchMovie.ts for improved type definitions ([1ee8938](https://github.com/Seenivers/App/commit/1ee8938608f2d659d666cffe7be01f29944125ea))
- add TypeScript types for TV show data structure ([9a5540b](https://github.com/Seenivers/App/commit/9a5540be1565dcee90f9089ebc84f5a4fc98e4b3))
- **api:** add getSerie function to fetch TV show details ([551ff86](https://github.com/Seenivers/App/commit/551ff860d530c0aace063218fdf48e411c3990a6))
- **api:** add getSerieSeason function to fetch season details for a TV show ([38061e1](https://github.com/Seenivers/App/commit/38061e15e1bb3b88a603116a6d35d298faff8998))
- **api:** add getSerieSeasonEpisode function to fetch episode details for a TV show ([7d64659](https://github.com/Seenivers/App/commit/7d6465945ad4ab01304db70cf83b9d185397182f))
- **backup:** implement backup utility functions for database management ([3674dc9](https://github.com/Seenivers/App/commit/3674dc96e17b51b0ab2714cac291f696d08310bf))
- **backup:** improve backup utility with error handling and directory management ([07afee9](https://github.com/Seenivers/App/commit/07afee9bbcf6fc33b0c6c7a08cd520bbbadcb408))
- **capabilities:** add permission to allow file copying ([0b4ff37](https://github.com/Seenivers/App/commit/0b4ff37d890c570a3ef7bb5d4afbd1184196d15a))
- check Discord activity status against settings before updating presence ([0801a1a](https://github.com/Seenivers/App/commit/0801a1a652451bbeb194185d1bf9ad70bc6127cf))
- **db:** add backup schema for managing backup records ([0f8a898](https://github.com/Seenivers/App/commit/0f8a898b13e40e84d432a5cd2d6a82717911b520))
- **db:** add backups to the database schema ([76f6001](https://github.com/Seenivers/App/commit/76f600168b17b072ec609510dc76b42f5c7b684c))
- erweitere Suchfunktionalität zur Unterstützung von TV-Serien in SearchList ([66a347d](https://github.com/Seenivers/App/commit/66a347d2cf71fb36e8630938cb2a3fb020b56c33))
- export addNewFilesToStatus function for external usage ([934ba48](https://github.com/Seenivers/App/commit/934ba484e81bc8710b7eb6c7a19b32a201958c8e))
- extended search functionality to support movies and TV series in searchMovieStatus ([3f16cde](https://github.com/Seenivers/App/commit/3f16cde343df3c90f003c04e5b2ecf3f167633be))
- implement isMovie utility function for file type detection ([4a3d9c3](https://github.com/Seenivers/App/commit/4a3d9c32f6d4ffebfaba37e0d9f782e702d4f919))
- implement setTheme function to manage theme selection and fallback ([78511cc](https://github.com/Seenivers/App/commit/78511ccb9bf857f3a99e81eabba10848484abaab))
- improve title and year display in the search results list ([1b6d32d](https://github.com/Seenivers/App/commit/1b6d32d8ed76dbdda55ca7ee9f14ea7bdaa1657c))
- integrate setTheme function in settings initialization ([4e7e998](https://github.com/Seenivers/App/commit/4e7e998107cbb94211b543494145580f46669f9f))
- mark themes array as readonly ([619638d](https://github.com/Seenivers/App/commit/619638d7634d49ce82897da73da8b1bdeb1eae53))
- **migrations:** add new migration with backup table creation ([9e8a131](https://github.com/Seenivers/App/commit/9e8a131d41275b67111b37ca1a3506e681fcf5e0))
- **migrations:** enhance settings migration to handle default values for theme and discordAktiv ([fab00ff](https://github.com/Seenivers/App/commit/fab00ffe1d8c58fcb0e7accfddc4bcd0a2f23826))
- **migrations:** update settings migration to handle null ignoredKeywords ([5889c81](https://github.com/Seenivers/App/commit/5889c819b6a14ac2bf7700dbb945a10e2a1acfb4))
- move updateMovieStatus function to utils for better organization ([76de5b6](https://github.com/Seenivers/App/commit/76de5b65a69ddfb6e93dcac4c4884d90b6d53eac))
- rename searchMovieStatus to searchMediaStatus for improved clarity ([e3bc059](https://github.com/Seenivers/App/commit/e3bc059eea749a4e5574c7936f06740f7ec58ce1))
- rename Tv type to Serie and update schema accordingly ([b8d8a47](https://github.com/Seenivers/App/commit/b8d8a47c8ed3a89b57fb75ad8f8c936d6ee9cdf9))
- replace 'watchTime' field with 'season' in serie schema ([512d87b](https://github.com/Seenivers/App/commit/512d87be282523f5aeb94c3b0071c0e68dbea4b1))
- set default theme to 'default' in HTML document ([c878da1](https://github.com/Seenivers/App/commit/c878da151849ce8a11572fcb28852f995f742072))
- **settings:** add backupInterval setting to manage backup frequency ([86c966c](https://github.com/Seenivers/App/commit/86c966cb44c5078cc13b528dbd8484edb4c71c22))
- streamline settings update function in settings page ([771caed](https://github.com/Seenivers/App/commit/771caeda6456a622fa9d750e21f19dd1cb06cbd2))
- **types:** add Episode type for media structure enhancement ([3f9df29](https://github.com/Seenivers/App/commit/3f9df29fe0e8984a481ab483cee4e039336310dc))
- **types:** add Season type for improved media structure ([3d8a27d](https://github.com/Seenivers/App/commit/3d8a27d95c03c92afde7e69932306c9484cbbb28))
- **types:** rename tv.ts to serie.ts ([0bfb65f](https://github.com/Seenivers/App/commit/0bfb65f694d3f8d0a14b9e08e1eeb8ce5dc173e8))
- **types:** reorganize TV types into a dedicated directory and update imports ([55390ba](https://github.com/Seenivers/App/commit/55390bada0ff534d966f02a987b12204c00b17c0))
- update 'updated' field in database schemas to use $defaultFn for default value ([4f91e5b](https://github.com/Seenivers/App/commit/4f91e5b2bb32bb3fdd0c6646a26ba7b65f78d317))
- update default value for 'episode' and 'season' fields to 1 in database schemas ([471fd47](https://github.com/Seenivers/App/commit/471fd47604e8b533ebbda91d28b84dc0f6a6e70f))
- update movies table schema to auto-increment id and handle conflicts ([4be0fad](https://github.com/Seenivers/App/commit/4be0fad83df6eb5c46470796ac395e8b08f81837))
- **updater:** integrate backup creation during update process ([cf3dd79](https://github.com/Seenivers/App/commit/cf3dd792ed703562f67322a888188b82c0c71583))
- **utils:** add utility folder for theme management, network status, session storage, logging, and element handling ([7c98519](https://github.com/Seenivers/App/commit/7c9851901d5e80ed051957e6d9b1cebaf715f3f0))
- **utils:** reorganize utility imports to use the new directory structure ([c7b8bf9](https://github.com/Seenivers/App/commit/c7b8bf9abc4eff57b7c7db8e48333d3a51ba9dff))

# [0.23.0](https://github.com/Seenivers/App/compare/v0.22.0...v0.23.0) (2025-02-16)

### Bug Fixes

- **deps:** update borsh and tauri-plugin-log to latest versions ([0bcbd61](https://github.com/Seenivers/App/commit/0bcbd61f6e18a9e4a0f33bf4a80c792f1bfd659e))
- **deps:** update dependency hls.js to ^1.5.20 ([8c61826](https://github.com/Seenivers/App/commit/8c618265199b8c8fa9d55fed9dc670168c9aec39))
- **deps:** update rust crate serde_json to 1.0.138 ([48d8c31](https://github.com/Seenivers/App/commit/48d8c316fc28fee9338c38a3e0853e4497006233))
- **deps:** update rust crate tauri-plugin-drpc to 0.1.3 ([e64a663](https://github.com/Seenivers/App/commit/e64a6633eedd762a01d9a4e5cce2b20a3afb271d))
- **deps:** update rust crate tauri-plugin-log to 2.2.1 ([747b8a1](https://github.com/Seenivers/App/commit/747b8a1aa4a975a9f1a62a6f38f6d233fee762d1))
- **deps:** update rust crate tauri-plugin-updater to 2.5.0 ([a0963d6](https://github.com/Seenivers/App/commit/a0963d66baa363ad5baa872edaebf194ed8fb1fe))
- **deps:** update tauri monorepo ([c2bfeb9](https://github.com/Seenivers/App/commit/c2bfeb9b686fce64beb2a13ae6fe626ee3bab269))
- improve movie addition logic and handle duplicate IDs ([5c463de](https://github.com/Seenivers/App/commit/5c463de956efe49ea22d94020b96d48bd78349e9))
- optimize movie addition logic to handle existing IDs and improve error handling ([68d81da](https://github.com/Seenivers/App/commit/68d81da991908dae286a7f897395055d4caaaa2a))
- refactor addNewMovies function to handle entries with IDs and indices for improved processing ([cdff646](https://github.com/Seenivers/App/commit/cdff646516e860f275e471911ec561cfa35c66c4))
- refactor getMovies function to structure movie data with IDs for better error tracking ([6d56ace](https://github.com/Seenivers/App/commit/6d56ace1a2b4ac4a6783cadc056af739f365edac))
- refactor movie addition to handle multiple IDs and improve batch processing ([e466708](https://github.com/Seenivers/App/commit/e4667086f06eab7732f772a827994c1ecdc817bf))
- refactor movie addition to handle multiple IDs and improve status updates ([dfb3d68](https://github.com/Seenivers/App/commit/dfb3d68749a9c07829d61997dd6336cfb1420be5))
- refactor movie ID handling to include indices for improved data processing ([89d8917](https://github.com/Seenivers/App/commit/89d891711e6de364465896bef6371df72871c580))
- simplify dirty tracking logic ([07ba9b9](https://github.com/Seenivers/App/commit/07ba9b98fe18018e0c4c87154169602dfd102f86))
- update movie status on download error ([c4b9200](https://github.com/Seenivers/App/commit/c4b920012f8db0515080561e2894e907d051c9c9))
- update seeniversURL for development environment ([ebd500b](https://github.com/Seenivers/App/commit/ebd500b49b96e1cc44cecf62110734e0eba2aec9))
- **workflow:** improve cache cleanup logic to avoid deleting already removed caches ([1931af8](https://github.com/Seenivers/App/commit/1931af84377d194715b34670e9ed0be9a1cb781b))

### Features

- implement getMovies function to fetch multiple movies with error handling ([3b48a71](https://github.com/Seenivers/App/commit/3b48a717b78c3e30f5a6ae38ec7547454726ef5c))

# [0.22.0](https://github.com/Seenivers/App/compare/v0.21.0...v0.22.0) (2025-02-08)

### Bug Fixes

- **dependencies:** add tauri-plugin-drpc and update related packages ([1ed29a4](https://github.com/Seenivers/App/commit/1ed29a4ff154afb8eec810fa864638ddceec41b1))
- **dependencies:** update Svelte version to 5.19.9 in package.json and pnpm-lock.yaml ([d063e12](https://github.com/Seenivers/App/commit/d063e12e48f83aa9e7a6406b86a45e3325956f1a))
- **deps:** update dependency @tauri-apps/plugin-log to ^2.2.1 ([0112ebd](https://github.com/Seenivers/App/commit/0112ebdd4ec8856eb2fad97b80eb320c7bf7d6a3))
- **deps:** update dependency drizzle-orm to ^0.38.4 ([5312412](https://github.com/Seenivers/App/commit/53124126c29fbc3b23af9c1273ea16dfeacf04c8))
- **desktop:** add DRPC permissions to desktop capabilities ([6289f8e](https://github.com/Seenivers/App/commit/6289f8e8945c7d6679c8c83b2f226cdb27d74e7e))
- **discord:** add Discord activity details for adding new movies ([da6889a](https://github.com/Seenivers/App/commit/da6889a8f93fcef0fac81d1a93e875701545bf6f))
- **discord:** add initial Discord activity details for movie collection viewing ([d9bf511](https://github.com/Seenivers/App/commit/d9bf511bf7c0c6f702781e0d9d786d8390074fc1))
- **discord:** add small images and timestamps to Discord activity options ([326835c](https://github.com/Seenivers/App/commit/326835c079f207e8bc1cdd9b4d5d9b1c9be947cb))
- **discord:** enhance Discord activity management with customizable options ([cee16af](https://github.com/Seenivers/App/commit/cee16afb23a90af0d3bbbd9b6c577d9ed8804d19))
- **discord:** implement Discord RPC activity management ([f642968](https://github.com/Seenivers/App/commit/f642968f3c76244c7c566b2e285d64e132c1028e))
- **discord:** make 'state' optional in Discord activity and update activity creation logic ([e0e9d7b](https://github.com/Seenivers/App/commit/e0e9d7bb829e8eb9d05f03ff0528e03c0508ae39))
- **discord:** remove async from onMount in multiple pages for Discord integration ([05c88f4](https://github.com/Seenivers/App/commit/05c88f4a9fe6e5cc645bb121ed27853dea758e0b))
- **discord:** remove timestamp setting from Discord RPC activity ([ded777c](https://github.com/Seenivers/App/commit/ded777c86b8018d8972d0d5cfefac9b9456ffcb1))
- **discord:** update activity type to 'Watching' for improved clarity ([e9cff9b](https://github.com/Seenivers/App/commit/e9cff9bc16bfe657f707103c73b6f9771557ff97))
- **discord:** update Discord activity details on movie collection view ([bc0e16c](https://github.com/Seenivers/App/commit/bc0e16cca3a5f362d3840ee9f8a22cdc7ad290f9))
- **discord:** update Discord activity details on movie page load ([f772425](https://github.com/Seenivers/App/commit/f772425c7815f615a9af7a1dc7849e967fbeb119))
- **discord:** update Discord activity details with current movie title and rating ([204cc62](https://github.com/Seenivers/App/commit/204cc6238815b39b8bad307367ae136f0aa33d04))
- **discord:** validate timestamps as integers before setting in Discord activity ([e5eeaf1](https://github.com/Seenivers/App/commit/e5eeaf15ff19af1531e693966e33168729f4aaeb))
- **index:** add Discord client ID to the library exports ([9c3a157](https://github.com/Seenivers/App/commit/9c3a157e125a178a3b8b8ed507edb687c35ec553))
- **layout:** initialize RPC connection in layout component ([17bf4dd](https://github.com/Seenivers/App/commit/17bf4dd743e36e53d4357c8602e16c49775412b4))
- **layout:** properly destroy DRPC connection on component unmount ([d237526](https://github.com/Seenivers/App/commit/d2375266a180e33785a3489262edbfcae552e666))
- **lib:** add Plyr and Vidstack formats to video file selection filters ([262ef16](https://github.com/Seenivers/App/commit/262ef16e428cac15142f012b433e6d1b18aeb747))
- **lib:** update video format extensions to include plyr and vidstack formats ([480b983](https://github.com/Seenivers/App/commit/480b983f1eb5a217372e5d7267f6964688f8d5f1))
- **migrations:** create new movies and settings tables with data migration ([0f607a2](https://github.com/Seenivers/App/commit/0f607a254782a7314ee9e9e1b0b32a025c7240a0))
- **migrations:** update settings migration to use default values for player and castImages ([8a9eebf](https://github.com/Seenivers/App/commit/8a9eebf6b6b3db7fd03c7ecc302ab12cd27da720))
- **movie:** correct spelling mistakes in the money formatting and prevent trailer thumbnails from being pulled ([09fbdd2](https://github.com/Seenivers/App/commit/09fbdd28ada5b13841117b062f4caf3618d6e6b8))
- **movie:** remove openUrl usage and update link to open in a new tab ([238eb0f](https://github.com/Seenivers/App/commit/238eb0fbfa2114e3fb52485188d2be633cef3810))
- **page:** simplify collection filtering using optional chaining and nullish coalescing ([6627a31](https://github.com/Seenivers/App/commit/6627a31aacd313bfc043ea4a08b0e9768fc5972a))
- **player:** conditionally render Plyr or Vidstack based on player settings in movie route ([516b97e](https://github.com/Seenivers/App/commit/516b97e517954ff52927bcabcc5efef93331fed0))
- **player:** rename Videoplayer component to Plyr in movie route ([1f8fd2f](https://github.com/Seenivers/App/commit/1f8fd2f25ac490840cd8b23d0170fc88307bb2e0))
- **sessionStorage:** change SearchCriteria type to interface for better extensibility ([9fd3bb2](https://github.com/Seenivers/App/commit/9fd3bb2d6790efe501c679940eed4500fe2cff42))
- **settings:** add onchange event to video player select for dirty state tracking ([7ad716d](https://github.com/Seenivers/App/commit/7ad716da71f3b5d6980f7d4b3320f0d95f42f9e8))
- **settings:** add range input for number of cast images to download ([a415a95](https://github.com/Seenivers/App/commit/a415a95195b5b3dd76275fd92583d88b93e77f78))
- **settings:** add video player selection to settings page ([2c7289c](https://github.com/Seenivers/App/commit/2c7289c2be3c2919ff5f4a9c8c4ed2bae1577f6a))
- **settings:** change textarea input event from oninput to onchange for better handling ([3195f2e](https://github.com/Seenivers/App/commit/3195f2e6dcb9f563c3abbf75aef88fef04d495f5))
- **settings:** improve dirty state tracking for settings form ([52a0cb2](https://github.com/Seenivers/App/commit/52a0cb2f09d964402815fac5552d9999896f2c62))
- **settings:** improve unsaved changes confirmation logic ([62f6453](https://github.com/Seenivers/App/commit/62f6453f55c1bc2f6d273657ba2a52917dd0a2b2))
- **settings:** replace castImages constant with settings.castImages in image loading logic ([a1eec87](https://github.com/Seenivers/App/commit/a1eec87b9f574dd5a82e1014d2e92787d5cdf459))
- **settings:** track form changes and prompt on unsaved changes ([e9ac6a6](https://github.com/Seenivers/App/commit/e9ac6a62540801d797cda851e585c8d08d15dfc4))
- **settings:** update labels and layout for better clarity and consistency ([810bb32](https://github.com/Seenivers/App/commit/810bb326ec70592b5e2e1d70c55c5ff8580ea7c0))
- **settings:** update navigation logic to use history back or redirect to home ([076e86b](https://github.com/Seenivers/App/commit/076e86b55f8f9bf9b2f857d8d37da0846ca017f9))
- **tauri:** add tauri_plugin_drpc to the Tauri builder ([af597e6](https://github.com/Seenivers/App/commit/af597e673601e6c3a62ea34bfb377e5e7125e9a1))
- **tv:** improve readability by adding braces to setTimeout callback ([7ff34af](https://github.com/Seenivers/App/commit/7ff34af4b23581b08deb9f0a7340e7776c5f9bb9))
- **types:** add castImages property to Settings interface and schema ([b69b62a](https://github.com/Seenivers/App/commit/b69b62ad8a09f1c917d4105549aa24bd8c827603))
- **types:** add player property to Settings interface for Plyr and Vidstack ([bc5bf7c](https://github.com/Seenivers/App/commit/bc5bf7c7057c55dfa2c983b37b84f11d90349a3c))
- **types:** add player property to settings schema with default value 'Plyr' ([e6fb606](https://github.com/Seenivers/App/commit/e6fb606a7a06ca5ec776feb08f04c257762bb09b))
- **videoUtils:** use optional chaining for safer watchTime access ([aa54df4](https://github.com/Seenivers/App/commit/aa54df46f108f47e988e4048f94d18e145b4b9e0))
- **workflow:** add repository checkout to cleanup job to fix cache deletion ([43c13a5](https://github.com/Seenivers/App/commit/43c13a504f4bfa5f1981fc6685f3b9e98441a1d6))
- **workflows:** enhance cache cleanup to delete caches for non-existent branches and retain only the newest two for active branches ([ca26c65](https://github.com/Seenivers/App/commit/ca26c65cec3b316e5bd04791e38bcc8be3857eca))
- **workflows:** improve cache cleanup logic to retain the newest two caches for pull requests ([24b4444](https://github.com/Seenivers/App/commit/24b4444e53f028df80cec2fb6c747ea5da9a63fe))
- **workflows:** improve cache cleanup script to enhance branch existence checks and retain only the newest two caches ([32b6423](https://github.com/Seenivers/App/commit/32b64232efbc0f2651351eab8e7540ac9c84725e))
- **workflows:** update cleanup script to delete multiple caches for pull requests ([9799bfe](https://github.com/Seenivers/App/commit/9799bfecfeab8014c5d9653c2b362bbb7f07d319))
- **workflows:** update permissions for cleanup job to allow read and write access ([397a457](https://github.com/Seenivers/App/commit/397a457dbe5d4f31cf273896ee5564c51a3ab719))
- **workflow:** update fetch-depth in format.yml to improve checkout efficiency ([0e8631c](https://github.com/Seenivers/App/commit/0e8631c820193625a0ae9f0652df98f6ea2a10cc))

### Features

- **discord:** add button support to Discord activity for enhanced interaction ([584ea8b](https://github.com/Seenivers/App/commit/584ea8b68f50ac38ec3e27f21aab004b5a35901e))
- **discord:** add development Discord activity details for improved presence ([67f3c84](https://github.com/Seenivers/App/commit/67f3c84a9bf3b47139a25a226b659a752f7f2da7))
- **discord:** add Discord activity details for actor viewing ([802ab34](https://github.com/Seenivers/App/commit/802ab34e4c1b135d2ba0e5122513d5fcfa641bd5))
- **discord:** initialize Discord integration on settings page ([052531a](https://github.com/Seenivers/App/commit/052531a7b797b562497f2fe8f4145ddd029ea26f))
- **utils:** add handleLinks function to manage external links with Tauri's openUrl ([99a2a61](https://github.com/Seenivers/App/commit/99a2a617155eee75c3eaa182843678d92ce9e5b6))
- **utils:** rename handleLinks to handleLinksAndImages and add functionality to make images non-draggable ([cba4095](https://github.com/Seenivers/App/commit/cba4095599cbd6a8ec4a93c55ee6c1864654430d))
- **utils:** rename handleLinksAndImages to handleElements and enhance functionality to make links non-draggable ([4333696](https://github.com/Seenivers/App/commit/4333696e6bb1c569e112530c909de1e43d2a247d))
- **workflows:** add workflow_dispatch trigger for cache cleanup on pull request closure ([7cc1811](https://github.com/Seenivers/App/commit/7cc18116339563dcd96df6f0ab7ef6707eeb2c53))

# [0.21.0](https://github.com/Seenivers/App/compare/v0.20.0...v0.21.0) (2025-01-29)

### Bug Fixes

- **actor:** improve error handling messages for browser and data validation ([0b38989](https://github.com/Seenivers/App/commit/0b389898d26f145281d84c157a23a1700f8f1c16))
- **collection:** add badge to indicate movies in the collection ([174e441](https://github.com/Seenivers/App/commit/174e441a3ff01a006719995cf8203838b8ab3a7e))
- **collection:** ensure safe access to movie properties in class bindings ([c09e847](https://github.com/Seenivers/App/commit/c09e8474a66ecb5981623ae60917e61b6efe6453))
- **collection:** update preload data behavior based on movie download status ([e6844f0](https://github.com/Seenivers/App/commit/e6844f0d6eddbfcdd911d1d03b625e33cb030e9f))
- **dependencies:** remove tauri-plugin-single-instance from Cargo files ([b2a6c74](https://github.com/Seenivers/App/commit/b2a6c74dc892ccce84cdbb46c8114e2ffdeaf5c8))
- **movie:** conditionally render Hauptdarsteller section based on cast availability ([ac7c5ae](https://github.com/Seenivers/App/commit/ac7c5ae98cdb0f6e4f2181b05427caad0136f4df))
- **movie:** ensure release date displays correctly or shows fallback message ([0fc7c34](https://github.com/Seenivers/App/commit/0fc7c34919b66706382ab3c87ec56703df66c194))
- **routes:** increase timeout duration before navigating back to improve user experience ([28415c9](https://github.com/Seenivers/App/commit/28415c9cd95465f8d0ad57eb448b8c7bb6b6a704))
- **routes:** move navigation logic to ensure it executes after URL opening ([5c6ab89](https://github.com/Seenivers/App/commit/5c6ab899ee6eadbfad99ee6f86d70a5085aa9dbc))
- **routes:** optimize error handling for actor and movie loading logic ([b2e2746](https://github.com/Seenivers/App/commit/b2e27466d376d5ef23426610b2689044fc0a6813))
- **routes:** refine movie and collection handling with type guards and improved filtering logic ([2ba01d1](https://github.com/Seenivers/App/commit/2ba01d174e4e54b8c7faded1726d943aef5c9390))
- **routes:** replace throw with error for better error handling in browser checks ([93679e6](https://github.com/Seenivers/App/commit/93679e651dad22cf4e36da9251f4b527ef6d51b9))

### Features

- **actor:** add functionality to save actor data to the database upon loading ([6ecf314](https://github.com/Seenivers/App/commit/6ecf314814a9bbc7c59fbd8d4526ebc43fbcdcce))
- **collection:** add movies array to collection load function ([a3df176](https://github.com/Seenivers/App/commit/a3df1761f8ae9ac9c7ceb31bd811ef37f1498522))
- **collection:** add movies array to collection page for enhanced movie display ([3c20c60](https://github.com/Seenivers/App/commit/3c20c609b32bcea8e4e8e25f1bc2c8c0aca0b6c3))
- **collection:** add updated timestamp to collection details ([ed9abb7](https://github.com/Seenivers/App/commit/ed9abb757801423c149a0cb051da7057694b6b14))
- **collection:** optimize collection loading with modular imports and error handling ([1a33ba9](https://github.com/Seenivers/App/commit/1a33ba954410bf42808a1eddc4cb7acf950254ee))
- **image:** implement lazy loading for images using Intersection Observer ([c437378](https://github.com/Seenivers/App/commit/c437378b388d3547b0de52f506f2b75c7943a0ee))
- **image:** refactor image loading to use async/await for improved performance ([65615a3](https://github.com/Seenivers/App/commit/65615a3288dbed62ae8ff230ccbfd0a291c6ae5a))
- **movie:** enhance movie page layout with trailer and main cast sections ([3c4f281](https://github.com/Seenivers/App/commit/3c4f281383373e1448ae89ccdfb1a6819e44716a))
- **movie:** improve movie loading logic with error handling and local fallback ([f90a86f](https://github.com/Seenivers/App/commit/f90a86f175437519fbeef4df312f2ddefe728cf0))
- **movie:** initialize movie path as null and add movie to module ([2f7a52d](https://github.com/Seenivers/App/commit/2f7a52dddb85a0f7a059117efaf7940cea858e0b))
- **routes:** replace navigator.onLine with online.current for improved online status handling ([2e9452a](https://github.com/Seenivers/App/commit/2e9452a07dcdc563de2d69b1b17fbde0f94ec04a))
- **workflow:** add cleanup workflow for cache on closed pull requests ([4695d4b](https://github.com/Seenivers/App/commit/4695d4b523006c05f9c2ec134ec251ba62070dbc))
- **workflow:** improve cache cleanup workflow for pull requests ([80c8543](https://github.com/Seenivers/App/commit/80c85436e314850cb021831347392de04ca12b73))

# [0.20.0](https://github.com/Seenivers/App/compare/v0.19.0...v0.20.0) (2025-01-28)

### Bug Fixes

- correct film status check logic before opening modal ([a369a29](https://github.com/Seenivers/App/commit/a369a29f307f059ac3bd80579bfe6d469a7e5dd6))
- **security:** update Content Security Policy to include seenivers.com ([c333ca6](https://github.com/Seenivers/App/commit/c333ca63a7a8f31b5b3c4bb47e6c93255e65038a))
- **security:** update img-src in Content Security Policy to allow YouTube images ([ce5278f](https://github.com/Seenivers/App/commit/ce5278fc5e4a0397dbbffbc243d95924985c9dff))

### Features

- add WEEKS constant for film update duration in database logic ([8d2201a](https://github.com/Seenivers/App/commit/8d2201a9ab7637e615ae45a2e5efa079a4cb2844))
- extended castImages logic to control the actor images to be downloaded ([53d4367](https://github.com/Seenivers/App/commit/53d43671ac4f94a34df6e3b577440a726bc1f11f))
- implement fallback to TMDB for collection data retrieval when offline ([10f2ccd](https://github.com/Seenivers/App/commit/10f2ccd54c1f3ae6e9af8a65f3f251169111ea14))
- update WEEKS constant to extend film update duration to 4 weeks ([f153a74](https://github.com/Seenivers/App/commit/f153a74bdfbaaef84ba95f8b5fe687fd473a9c4f))

# [0.19.0](https://github.com/Seenivers/App/compare/v0.18.2...v0.19.0) (2025-01-25)

### Bug Fixes

- **deps:** update dependency @tauri-apps/plugin-opener to ^2.2.5 ([855505c](https://github.com/Seenivers/App/commit/855505c9c50a6abd7fd261f69d8c1e4ed6c03a87))
- **deps:** update rust crate serde_json to 1.0.137 ([ea3bed4](https://github.com/Seenivers/App/commit/ea3bed4745c1edacfacc74e3d3addb1c3ebdecf5))
- **deps:** update rust crate tauri-plugin-opener to 2.2.5 ([0bb8d5c](https://github.com/Seenivers/App/commit/0bb8d5ca2b80632288e2427f5ca209c027dc6cde))
- **deps:** update rust crate tauri-plugin-single-instance to 2.2.1 ([8e8bfbf](https://github.com/Seenivers/App/commit/8e8bfbf51986f29c4442c3c3cfbf69603321445b))
- **deps:** update tauri monorepo ([1d661b8](https://github.com/Seenivers/App/commit/1d661b81c8933ef66e45228e56791d4f3c92ba49))
- **movie:** ensure movieData.path is checked before opening external player ([da37ab8](https://github.com/Seenivers/App/commit/da37ab8684b5e165ac8e82284940e1e345df99e8))
- **movie:** replace form with button for closing modal ([aa24c10](https://github.com/Seenivers/App/commit/aa24c104c056f34c842738bec8e5d4e8ac54cd58))
- **movies:** make 'path' field nullable in movies schema ([9280124](https://github.com/Seenivers/App/commit/9280124e0cd0d1e165e3fac2f07c3eaabc18dbdf))

### Features

- **db:** add deleteActor function to remove actors by ID ([4b3bad4](https://github.com/Seenivers/App/commit/4b3bad4180950e4d6dca2a89826f34c6905f1845))
- **db:** add deleteCollection function to remove collections by ID ([5956613](https://github.com/Seenivers/App/commit/59566139708ac3aab77ee924f473b1c377a72c3c))
- **db:** add isActorIDUnique function to check for unique actor IDs ([e01837d](https://github.com/Seenivers/App/commit/e01837def474bf6ebd605ca4789efa6b8e15f0da))
- **db:** add updateActor function to modify actor details by ID ([b2595e2](https://github.com/Seenivers/App/commit/b2595e2457c9a36e5a4d4fea108116b681b1f6bf))
- **db:** add updateCollection function to modify collections by ID ([4f2330c](https://github.com/Seenivers/App/commit/4f2330c685dadbb9a71f0d7311c4148282b18077))
- **plugins:** add tauri-plugin-single-instance for single instance application support ([bc6528d](https://github.com/Seenivers/App/commit/bc6528d3f53ef87c1a87107964ab3be896a147ca))
- **plugins:** enhance single instance plugin to focus main window on launch ([52df561](https://github.com/Seenivers/App/commit/52df561ab6bc97c855652a18b6c14f7c15c5cb2d))

## [0.18.2](https://github.com/Seenivers/App/compare/v0.18.1...v0.18.2) (2025-01-20)

### Bug Fixes

- **movie:** use openPath instead of openUrl for opening video files ([11acb19](https://github.com/Seenivers/App/commit/11acb19647167e6077c3ccd37fc83be2bacd5a20))
- **tauri:** add permissions for opener to allow opening URLs and paths ([4c6b8d4](https://github.com/Seenivers/App/commit/4c6b8d45b23029733d11f3914c7680458b7f3d9b))
- **tauri:** update media-src to allow assets from http://asset.localhost ([f326ad7](https://github.com/Seenivers/App/commit/f326ad716614b7d2cf8593f49d6cc134427e3909))

## [0.18.1](https://github.com/Seenivers/App/compare/v0.18.0...v0.18.1) (2025-01-18)

### Bug Fixes

- add dependency on format job for semantic release ([db9e863](https://github.com/Seenivers/App/commit/db9e863855bc17b8c05d47261b66689c895800e9))
- **deps:** update dependency @tauri-apps/plugin-opener to ^2.2.3 ([c7fe647](https://github.com/Seenivers/App/commit/c7fe6479afb46001c43193fe288cd03e9b90faa4))
- **deps:** update dependency @tauri-apps/plugin-opener to ^2.2.4 ([3d58c1a](https://github.com/Seenivers/App/commit/3d58c1a37762fc19b2ff4e4acf7ca3c67c80805e))
- **deps:** update dependency @tauri-apps/plugin-updater to ^2.3.1 ([a663243](https://github.com/Seenivers/App/commit/a663243b41fcbf419dcc625d25df05501199e48d))
- **deps:** update dependency better-sqlite3 to ^11.7.2 ([8692417](https://github.com/Seenivers/App/commit/8692417cee412f2bc7d2077284b4596de87a33ce))
- **deps:** update dependency better-sqlite3 to ^11.8.1 ([8db3174](https://github.com/Seenivers/App/commit/8db31740fb1add44edcc890a97ab4523325a401e))
- **deps:** update dependency hls.js to ^1.5.19 ([f29394f](https://github.com/Seenivers/App/commit/f29394f9d8f954a5d1cb407a73df099a8e390cc4))
- **deps:** update rust crate serde_json to 1.0.135 ([da292b4](https://github.com/Seenivers/App/commit/da292b48b94e7493038db02ef911d36e794c1faa))
- **deps:** update rust crate tauri-plugin-opener to 2.2.3 ([f3c5ac2](https://github.com/Seenivers/App/commit/f3c5ac287d1a3e04a9f76e1993d9d4a1bb094514))
- **deps:** update rust crate tauri-plugin-opener to 2.2.4 ([5035b68](https://github.com/Seenivers/App/commit/5035b68c4c51dd153f94e210cc763fc58fd5b542))
- **deps:** update rust crate tauri-plugin-updater to 2.3.1 ([8d04945](https://github.com/Seenivers/App/commit/8d049453a2f266ad464fa0a1993875ff166756bd))
- **deps:** update tauri monorepo ([c680f0a](https://github.com/Seenivers/App/commit/c680f0a3c53aebfc0d0dcd75e15491fb5075c3a4))
- **deps:** update tauri monorepo ([b39f7b7](https://github.com/Seenivers/App/commit/b39f7b7e5c79ab536089a8e9b3d4379f5907f963))
- **deps:** update zbus to version 5.2.0 and tauri-plugin-opener to version 2.2.4 ([9ca3df1](https://github.com/Seenivers/App/commit/9ca3df1901e881785dd7dc0af610792ed900b1b1))
- improve actor age calculation by handling death date ([c291616](https://github.com/Seenivers/App/commit/c2916161a62798b4803689d6e0cee6057cfbd46a))
- open media links in a new tab ([b2c346c](https://github.com/Seenivers/App/commit/b2c346c66376f4c4f9d8fddc8815aac041f16a62))
- refactor actor filmography and crew display for improved readability ([9a3f450](https://github.com/Seenivers/App/commit/9a3f4503767cef7c0f220e2daba6d13ede12797e))
- remove automergeSchedule from Renovate configuration ([227ab27](https://github.com/Seenivers/App/commit/227ab27fe6d58abc6c01ff879eb12bed55575d5e))
- remove tauri-plugin-shell dependency and related configurations ([4a08ff7](https://github.com/Seenivers/App/commit/4a08ff7c1427e2c8a25446f704e2582edc9854f7))
- remove unused type imports from actor page component ([7765e5a](https://github.com/Seenivers/App/commit/7765e5a5547cf34b67e091d6eea0f9af6568479b))
- remove updaterJsonPreferNsis from release workflow ([4a0fb0b](https://github.com/Seenivers/App/commit/4a0fb0be95e27a0897e130305fd8cceda23483c9))
- replace deprecated open function with openUrl for external links ([7c8db34](https://github.com/Seenivers/App/commit/7c8db3421783349de567f2969d3545c88fecb954))
- swap gender labels for actor representation ([651eb81](https://github.com/Seenivers/App/commit/651eb8199973213b466cf517359187b7191e2bdc))
- update actor filmography links to use correct media type URLs ([b50eea2](https://github.com/Seenivers/App/commit/b50eea29f066d620eff0e27f58e622af71a1794b))
- update target formats in tauri configuration ([f981cad](https://github.com/Seenivers/App/commit/f981cadade6f74705470b24f14778a6b7aa7cde0))
- update VSCode settings to ignore additional files and directories ([1a0f14e](https://github.com/Seenivers/App/commit/1a0f14e6e602b94513472f9f77bc2740c306f3f3))
- **workflows:** adjust job dependencies for code formatting and semantic release ([5d06201](https://github.com/Seenivers/App/commit/5d0620158aceb06bf07a2a2abaee366068ba011a))
- **workflows:** update job dependency for Tauri release to depend on format ([0faf883](https://github.com/Seenivers/App/commit/0faf883aa26721ad2e4c4afb395f4a5dc18b0e5f))

# [0.18.0](https://github.com/Seenivers/App/compare/v0.17.0...v0.18.0) (2025-01-13)

### Bug Fixes

- add write permissions for content in the release workflow ([37328cb](https://github.com/Seenivers/App/commit/37328cb79d5d6f029333615ea53582d9fe42ed03))
- **layout:** prevent context menu in production environment ([7293861](https://github.com/Seenivers/App/commit/72938610b7b2b1f07e3cb9279480286798d47aee))
- **macOS:** add `signingIdentity` to Tauri config for self-signing ([1fedd00](https://github.com/Seenivers/App/commit/1fedd00444b54d8d668fbf3309b16ee410fa6d07))
- update Renovate schedule to run before 5 a.m. and set timezone to Europe/Berlin ([bcfc28d](https://github.com/Seenivers/App/commit/bcfc28de924f6730dbfb9ed39f90f1bb2ddada9a))

### Features

- add error handling and actor details localization in German and English ([c8fb6c8](https://github.com/Seenivers/App/commit/c8fb6c803e057b45457dd3ed433f548d06f4eaca))
- add network status localization in German ([4c945af](https://github.com/Seenivers/App/commit/4c945af368921d41abd3f02032880b54dc43dd05))
- add network status messages and enhance add page localization in English ([486d332](https://github.com/Seenivers/App/commit/486d3321dbb24984ec901c7408429521caa52cec))
- add support for German, French, and Spanish translations ([c17492c](https://github.com/Seenivers/App/commit/c17492c2d0253f230926148948c46144ab1e858e))
- **dependencies:** add svelte-i18n for internationalization support ([bf7fe35](https://github.com/Seenivers/App/commit/bf7fe355cc3d2840d9cd8bff94c625670498f57a))
- **docs:** add Crowdin badge to README ([06372b2](https://github.com/Seenivers/App/commit/06372b2f1ff3cbf83311ef7f2a3f8652cd990332))
- enhance German localization for add page and modal components ([74856ec](https://github.com/Seenivers/App/commit/74856ecadc26879a422131d211ce1352c40e0771))
- **i18n:** add internationalization support for title in the main page ([82eef02](https://github.com/Seenivers/App/commit/82eef02ad70a500f8e7a49f68dfc7358082a3201))
- **i18n:** configure i18n-ally settings for locale paths and key style ([58b4c8f](https://github.com/Seenivers/App/commit/58b4c8f1126e5dca3a8e4953fbee34cc436133fd))
- **i18n:** extended German translations for navigation and loading displays ([5f9a448](https://github.com/Seenivers/App/commit/5f9a448d2751f939831c49cb51a14c7db195ca5c))
- **i18n:** extended German translations for search filters and loading displays ([e88eb7b](https://github.com/Seenivers/App/commit/e88eb7b3867e5015fb4b81d003f1ecf5755a0106))
- **i18n:** implement internationalization with German locale support ([cc94b73](https://github.com/Seenivers/App/commit/cc94b738a82bbc8e3d9ef73426d0f5683fc5fb0e))
- implement localization for navigation buttons in German ([bb2b1f0](https://github.com/Seenivers/App/commit/bb2b1f0bc8ee330e8655af298cabe1e1fb5e63c9))
- **movie:** display YouTube trailers when available ([3105b66](https://github.com/Seenivers/App/commit/3105b666e88218b8281647452fd9eae29c75ebe8))
- update i18n-ally settings for improved localization management ([8625cf5](https://github.com/Seenivers/App/commit/8625cf54d67ea2c05cdd2304d012da4739566113))
- **workflow:** add code formatting job to release workflow ([76a5e37](https://github.com/Seenivers/App/commit/76a5e37f376716ba543053004b6ef83796afecfc))

# [0.17.0](https://github.com/Seenivers/App/compare/v0.16.1...v0.17.0) (2025-01-07)

### Bug Fixes

- **docs:** update GitHub License badge link in README.md ([1543250](https://github.com/Seenivers/App/commit/15432505e06246460ab236a320a2e7c480ae7786))
- enable updaterJsonPreferNsis in release workflow for improved installer handling ([265b1d2](https://github.com/Seenivers/App/commit/265b1d27d75d05aa49422d894a3864da11145a1c))
- **renovate:** remove unnecessary npm label from automerge configuration ([fba2583](https://github.com/Seenivers/App/commit/fba2583fcf25acbdeea60badb939f1484d5f8dae))
- **tsconfig:** add vidstack types for improved type checking in Svelte ([76ac22b](https://github.com/Seenivers/App/commit/76ac22b3b1d35a610ded3d67c8d62f03a242eca0))
- update migration file path handling to use join for better compatibility ([783a10d](https://github.com/Seenivers/App/commit/783a10d56232928da3b2df430b9d1ab446458dcb))
- update targets in tauri configuration to 'all' for broader compatibility ([398652e](https://github.com/Seenivers/App/commit/398652e58c903986ce6fe71b5ddaf83202ea97fd))

### Features

- add SECURITY.md to outline security policy and reporting procedures ([72685fb](https://github.com/Seenivers/App/commit/72685fb6d5e0ae7dd83906e4706b64235d41e616))
- add vidstack dependency for enhanced video handling ([706d62b](https://github.com/Seenivers/App/commit/706d62b06b0c862d529119bf4adf242add568fcd))
- **csp:** add media-src directive to tauri configuration ([f83f9b9](https://github.com/Seenivers/App/commit/f83f9b9d3187e6b456304115218b6bfd7415b99d))
- **dependencies:** add hls.js version 1.5.18 to package.json and pnpm-lock.yaml ([6100b73](https://github.com/Seenivers/App/commit/6100b732f7fd88072057806b9567047e96423fa5))
- **dependencies:** update schedule to run on Sundays and Saturdays for better automation ([7b76591](https://github.com/Seenivers/App/commit/7b76591a385103fa2f659dfa87f3aa174d33affd))
- **i18n:** add Vidstack URL for documentation reference ([1f48bac](https://github.com/Seenivers/App/commit/1f48baceff75ea8b0248cb7698d1e7263e1f7102))
- implement Vidstack player component for video playback and tracking ([8935775](https://github.com/Seenivers/App/commit/89357753af2e30baff3a898c70e846c3fd6a8651))
- **movie:** display genres as badges for improved visual clarity ([cdcd4f5](https://github.com/Seenivers/App/commit/cdcd4f5f25f385ac815897feea8f34dba879c6c4))
- **movie:** enhance movie details display with additional information ([289aaf4](https://github.com/Seenivers/App/commit/289aaf4de97941d0b91e1eaaae7bdbefe1f789b8))
- **movie:** improve movie details layout and format monetary values ([e687192](https://github.com/Seenivers/App/commit/e68719292ee3d8756d0ee12c08e4794984849487))
- **movie:** remove homepage section for cleaner movie details display ([6e9847b](https://github.com/Seenivers/App/commit/6e9847bc349230526bb9c78a30fea41e4356f4f0))
- **movie:** remove unnecessary text-base class for improved layout consistency ([5783013](https://github.com/Seenivers/App/commit/5783013ebb8d7c1d5388d0197ab55d9b94c7eb55))
- **readme:** add GitHub badges for stars, forks, issues, contributors, downloads, and latest release ([77715b6](https://github.com/Seenivers/App/commit/77715b61b801ba081988b07a24dcea1b3893f3ff))
- **renovate:** add 'dependencies' label to update configurations for better categorization ([994dc4a](https://github.com/Seenivers/App/commit/994dc4ab58e5dd3d7e3b4973145d612ad4789ed2))
- **renovate:** add automergeSchedule for improved dependency management ([af54132](https://github.com/Seenivers/App/commit/af54132328919068f42e80d6409ad3a72633309e))
- **renovate:** update schedule and automergeSchedule to run on weekends during early hours ([f43b49b](https://github.com/Seenivers/App/commit/f43b49b055e8b4d5abf7e17301354b0fd00f4514))
- **search:** implement session storage for search criteria management ([960b887](https://github.com/Seenivers/App/commit/960b88769a16b0f7ba93a7b5bcbc493db4054f35))
- **settings:** add 'Trailer' option to default keywords ([8cb4b24](https://github.com/Seenivers/App/commit/8cb4b24330f91d2a886a7743a6cda1703f414db5))
- **types:** replace string types with ISO3166_1 and ISO639_1 for better type safety ([5503e93](https://github.com/Seenivers/App/commit/5503e937eb598c43773bfbbc6afc4b58461b8956))
- **Vidstack:** save component state on destroy ([1c19ad7](https://github.com/Seenivers/App/commit/1c19ad7b9deadc75cf984beecc3a1957352d0134))
- **vite:** add vidstack plugin for enhanced video capabilities ([f6d6320](https://github.com/Seenivers/App/commit/f6d6320f09a45540b4a0388aa1b828a35e5db688))
- **vscode:** add custom HTML data for vidstack in settings ([437d8a6](https://github.com/Seenivers/App/commit/437d8a607000c5760df289a2f9e5afedb7555bbb))
- **workflow:** add code formatting workflow using Prettier for consistent style ([6e2314a](https://github.com/Seenivers/App/commit/6e2314a931143bc2648ff623e2b513b27fe8d838))
- **workflow:** update format workflow to include write permissions and simplify push command ([eabf548](https://github.com/Seenivers/App/commit/eabf548d65941b9461dad3e7c4ccf6246b1cef7b))
- **workflow:** update Node.js setup to use latest LTS version for improved compatibility ([2b4d82a](https://github.com/Seenivers/App/commit/2b4d82a2d2df2b5bf625a3284cab39a34178d011))

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
