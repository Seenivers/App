# [0.7.0-next.1](https://github.com/Seenivers/App/compare/v0.6.0...v0.7.0-next.1) (2024-10-29)


### Features

* **release:** update GitHub Actions workflow to include asset count check for Tauri Release ([d946f7e](https://github.com/Seenivers/App/commit/d946f7e6f0bf670da78aa29c57e32f9c7f750607))

# [0.6.0](https://github.com/Seenivers/App/compare/v0.5.0...v0.6.0) (2024-10-29)


### Bug Fixes

* **deps:** update rust crate tauri-plugin-store to v2.1.0 ([680a334](https://github.com/Seenivers/App/commit/680a3345003433e06598cc92018f3f6dfa54174c))
* **release:** manually bump version to 0.5.0 due to semantic-release issue ([b928ef3](https://github.com/Seenivers/App/commit/b928ef3abf342fb6f0ce94d5e95970dd7b456ed0))
* **workflow:** correct syntax in Check Asset Count step ([6bc569a](https://github.com/Seenivers/App/commit/6bc569a69143464b5a565e12b33f6be669f12652))
* **workflow:** remove extra 'v' from release name to avoid 'vv...' issue ([3819e9c](https://github.com/Seenivers/App/commit/3819e9c364daeb1ff7e4b3d7defa3b25b51c33a3))


### Features

* **ci:** add asset count check to semantic-release job and streamline release workflows ([e4a8fae](https://github.com/Seenivers/App/commit/e4a8fae3cd8838b1e52da30caffc79542fdde7bf))
* **release:** add asset count check to skip Tauri Release if more than 3 assets found ([43a6c96](https://github.com/Seenivers/App/commit/43a6c965260abb4284e94a3c359f36de83384a6b))
* **release:** add conditional execution for Tauri Release based on successful Semantic Release ([6a218f1](https://github.com/Seenivers/App/commit/6a218f15f7c798e306266d6f82674ea4a8271caf))
* **release:** add release check and conditional Tauri release steps ([6291656](https://github.com/Seenivers/App/commit/62916568ac13633ca4811fd6dbbd4b2aecd41798))

# [0.5.0](https://github.com/Seenivers/App/compare/v0.4.1...v0.5.0) (2024-10-23)

### Bug Fixes

- **workflow:** add GitHub token to log release details step ([9280eea](https://github.com/Seenivers/App/commit/9280eeae4f227b369680359505b3c073eb33a0d8))
- **workflow:** escape newlines in release body for artifact upload ([f16b999](https://github.com/Seenivers/App/commit/f16b999bcc60d8bc6f74fa263b703f0b06df7f18))
- **workflow:** replace sed with awk and printf for better cross-platform compatibility ([e212fc2](https://github.com/Seenivers/App/commit/e212fc27d3a737bb32c9794f2a3d96990d4d2681))
- **workflows:** escape line breaks in release body for JSON compatibility ([7da6563](https://github.com/Seenivers/App/commit/7da65634b69dd952236609822b82b8bb38bded0d))
- **workflow:** update sed command for cross-platform compatibility on macOS and Linux ([b931532](https://github.com/Seenivers/App/commit/b931532177ceee840f7a9bddf5fd97bd9d9303fe))

### Features

- **action:** add custom GitHub Action for automating releases with Changesets ([8b47706](https://github.com/Seenivers/App/commit/8b477068a51ea097b0e2f88c19cfe614ae86cd8f))
- **release:** add bump and release scripts with changeset integration ([914b76a](https://github.com/Seenivers/App/commit/914b76aedc5aecb7450b9625e956f9a3258a6647))
- **release:** add shell: bash to Read Release Details step for improved compatibility ([733a1ec](https://github.com/Seenivers/App/commit/733a1ecc67594f8e22a1424081b19fa30bddd20b))
- **release:** add support for tag-based releases ([a7f0320](https://github.com/Seenivers/App/commit/a7f032080ab26ea18bc4dd7e0bd68b928c3745a2))
- **release:** create reusable Tauri Release action for publishing Tauri app ([8788a8f](https://github.com/Seenivers/App/commit/8788a8f83aee4ee32f5aa1ac8e34afd4c1693eb1))
- **release:** escape newlines and quotes in release body for consistent formatting ([2a13f31](https://github.com/Seenivers/App/commit/2a13f31427f894f9750d9b633320b597d8595549))
- **release:** improve release workflow by dynamically passing release details between steps ([80002ff](https://github.com/Seenivers/App/commit/80002ff0ba9d70b6be382f6fdd577e9c9e96b39f))
- **release:** integrate semantic-release with configuration for main and next branches ([225e751](https://github.com/Seenivers/App/commit/225e751446e34f902f2a38efe374ba8ac6eece1d))
- **release:** remove carriage returns and escape newlines and quotes in release body ([9e310bb](https://github.com/Seenivers/App/commit/9e310bbcbca84104e305b9960bf9f0c0c38da181))
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
