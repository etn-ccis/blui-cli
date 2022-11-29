# Changelog

## v2.2.0 (November 29, 2022)

### Changed

-   Update angular projects to use angular 14.

## v2.1.0 (November 1, 2022)

### Changed

-   Updated generated projects to build with the latest version of React native.

## v2.0.0 (April 4, 2022)

### Changed

-   Updated dependencies to the latest ([#116](https://github.com/brightlayer-ui/brightlayer-ui-cli/issues/116)).
-   Update angular projects to use angular 13.
-   Updated bundle size budgets when building angular projects.

### Removed

-   Removed ability to generate new Ionic projects. (#115)[https://github.com/brightlayer-ui/brightlayer-ui-cli/issues/115]
-   Removed ability to generate new React Native projects using Expo. (#114)[https://github.com/brightlayer-ui/brightlayer-ui-cli/issues/114]

### Added

-   Added functionality to enforce valid template selection ([#52](https://github.com/brightlayer-ui/brightlayer-ui-cli/issues/52)).

## v1.8.2 (December 16, 2021)

### Changed

-   Changed package namespace from `@pxblue` to `@brightlayer-ui`.

## Package Migration Notice

Previous versions listed after this indicator refer to our deprecated `@pxblue` packages.

---

## v1.8.2 (November 1, 2021)

### Changed

-   Use `react-native` v0.64.1 in JS projects due to compatibility issues between `react-native` v0.65.0 and `react-native-keyboard-aware-scroll-view`.

## v1.8.1 (October 7, 2021)

### Changed

-   Use `react-native` v0.64.1 in TS projects due to compatibility issues between `react-native` v0.65.0 and `react-native-keyboard-aware-scroll-view`.

## v1.8.0 (October 1, 2021)

### Changed

-   Add new dependency for `@pxblue/react-native-vector-icons`.
-   Update angular projects to use angular 12.
-   Update dependencies.

## v1.7.1 (May 14, 2021)

### Changed

-   Changed ionic project creation tool from `ionic` to `@ionic/cli`.

## v1.7.0 (May 7, 2021)

### Added

-   Added support for ionic templates.

### Removed

-   IE11 is no longer supported by Microsoft, we so no longer include the necessary configurations to run projects on that browser.

## v1.6.0 (April 19, 2021)

### Added

-   Support for using different versions of templates for testing / debugging.

## v1.5.0 (April 1, 2020)

### Added

-   Jest configurations for React Native projects using RNC CLI.

### Fixed

-   Enable commands to work with npm version 7 (https://omrilotan.medium.com/npx-breaking-on-ci-b9f3f61d4676). With NPM 7 the CLI **must** be installed globally and will not run via npx.

## v1.4.0 (March 3 ,2021)

### Added

-   React Native template for Blank, Routing, and Authentication (for TypeScript and Javascript projects)

## v1.3.0 (February 16, 2021)

### Added

-   SVG support for React Native projects

### Changed

-   Update dependencies for React Native

## v1.2.0 (January 25, 2021)

### Added

-   Angular Templates for Blank, Routing, and Authentication

## v1.1.0 (December 10, 2020)

### Added

-   React Templates for Blank, Routing, and Authentication (for TypeScript and Javascript projects)

## v1.0.6 (October 30, 2020)

### Changed

-   Update angular projects to use angular 10
-   Update all PX Blue dependencies to latest versions

### Fixed

-   Fix missing import statements in new React projects

## v1.0.5 (September 29, 2020)

### Changed

-   Remove `tslint.json` when using PX Blue's ESLint config.

## v1.0.4 (August 4, 2020)

### Changed

-   Angular project theme classes moved to `<body>` instead of `<app-root>` to support theming of overlay containers.

## v1.0.0 (May 8, 2020)

-   Initial Release
