# [0.6.0](https://github.com/Seenivers/App/compare/v0.5.0...v0.6.0) (2024-10-21)


### Features

* **workflow:** refactor Tauri Release to use inputs for release details ([7ad079a](https://github.com/Seenivers/App/commit/7ad079a52b96a6ae6b7c87c1b1045ab26300567f))
* **workflow:** remove release.yml from GitHub Actions ([b0cf262](https://github.com/Seenivers/App/commit/b0cf2623fd275f853c7ffab88ad549feb322f8d0))
* **workflow:** update Semantic Release to trigger on push and set output variables ([ae6fba8](https://github.com/Seenivers/App/commit/ae6fba8661c2fdad2886e6836c5bcbf02928cf5f))

# [0.5.0](https://github.com/Seenivers/App/compare/v0.4.1...v0.5.0) (2024-10-21)


### Features

* **action:** add custom GitHub Action for automating releases with Changesets ([8b47706](https://github.com/Seenivers/App/commit/8b477068a51ea097b0e2f88c19cfe614ae86cd8f))
* **release:** add bump and release scripts with changeset integration ([914b76a](https://github.com/Seenivers/App/commit/914b76aedc5aecb7450b9625e956f9a3258a6647))
* **release:** add support for tag-based releases ([a7f0320](https://github.com/Seenivers/App/commit/a7f032080ab26ea18bc4dd7e0bd68b928c3745a2))
* **release:** integrate semantic-release with configuration for main and next branches ([225e751](https://github.com/Seenivers/App/commit/225e751446e34f902f2a38efe374ba8ac6eece1d))
* **workflow:** change Tauri Release trigger to workflow_call ([1e94eef](https://github.com/Seenivers/App/commit/1e94eeff3dca10a17a4a6b8271d13b22aad2a95a))
* **workflow:** enable Tauri Release for workflow_dispatch triggers ([d9b2bac](https://github.com/Seenivers/App/commit/d9b2bac495746c0b0268e271bb85a0a1ce3ae853))
* **workflow:** merge Semantic Release and Tauri workflows into a single release process ([f8ca7f2](https://github.com/Seenivers/App/commit/f8ca7f25bed035e67b1877024216efb922b68c78))

# [0.5.0](https://github.com/Seenivers/App/compare/v0.4.1...v0.5.0) (2024-10-20)


### Features

* **action:** add custom GitHub Action for automating releases with Changesets ([8b47706](https://github.com/Seenivers/App/commit/8b477068a51ea097b0e2f88c19cfe614ae86cd8f))
* **release:** add bump and release scripts with changeset integration ([914b76a](https://github.com/Seenivers/App/commit/914b76aedc5aecb7450b9625e956f9a3258a6647))
* **release:** add support for tag-based releases ([a7f0320](https://github.com/Seenivers/App/commit/a7f032080ab26ea18bc4dd7e0bd68b928c3745a2))
* **release:** integrate semantic-release with configuration for main and next branches ([225e751](https://github.com/Seenivers/App/commit/225e751446e34f902f2a38efe374ba8ac6eece1d))
* **workflow:** change Tauri Release trigger to workflow_call ([1e94eef](https://github.com/Seenivers/App/commit/1e94eeff3dca10a17a4a6b8271d13b22aad2a95a))

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
