# Repository Guidelines

## Project Structure & Module Organization

This is the GUPEA customization of DSpace Angular 8, using Angular 17 and server-side rendering. `src/app/` contains core components and services; `src/themes/gupea/` contains institutional overrides, styles and assets. Prefer theme overrides for presentation changes. `src/assets/i18n/` holds runtime translations; `gub_i18n/` contains translation tooling. Unit specs sit beside implementation files; Cypress scenarios live in `cypress/e2e/`. Configuration lives in `config/`, deployment tooling in `docker/`, and documentation in `docs/`.

## Build, Test, and Development Commands

Use Yarn 1 with the committed `yarn.lock`; the README supports Node 18 or 20 for this branch.

- `yarn install --frozen-lockfile`: install reproducible dependencies.
- `yarn start:dev`: launch the development server with reloads.
- `yarn build:prod`: build browser and SSR production bundles.
- `yarn test`: run Angular unit tests once.
- `yarn test:headless`: run ChromeHeadless tests with coverage.
- `yarn lint`: compile local lint plugins and run ESLint.
- `yarn check-circ-deps`: detect circular imports.
- `yarn cypress:open`: open the browser integration-test runner.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, UTF-8, LF endings and single quotes in TypeScript. Match existing Angular naming: kebab-case files such as `header.component.ts`, PascalCase classes and adjacent `.html`, `.scss` and `.spec.ts` files. Follow ESLint rules, including local DSpace rules in `lint/`. Document new or modified public classes and methods with TypeDoc. Keep browser-only behavior compatible with SSR.

## Testing Guidelines

Unit tests use Jasmine and Karma; browser scenarios use Cypress (`*.cy.ts`). Name unit tests `*.spec.ts`. Add or update meaningful tests for changed behavior, and run relevant specs plus lint before review. Coverage output is under `coverage/dspace-angular`; Karma does not define a numeric coverage threshold. Integration tests require suitable frontend/backend configuration and test data.

## Commit & Pull Request Guidelines

History uses short imperative subjects, such as “Add fields for item page”; issue prefixes such as `DSPACE-139` also appear. Keep commits focused. Follow `.github/pull_request_template.md`: summarize behavior, link issues and backend dependencies, and provide reviewer test steps and screenshots for visual changes. Explain unusually large PRs, document configuration changes, and check dependency-license compatibility.

## Configuration & Migration

Keep credentials out of tracked configuration. Verify the REST endpoint before local testing. Consult `docs/dspace-10-migration.md` for customization dependencies and the upgrade checklist; distinguish current 8.x commands from future 10.1 tooling.

The goal is to migrate GUPEA from DSpace 8 to 10.1.

Core DSpace modifications should be minimized.

Theme overrides are preferred when practical.

Changes should be incremental, with tests and builds run where possible.

No application code should be changed without a clearly defined migration task.

The Dspace 8 branch to be migrated is gub-dspace-8_x.

The target branch for the migration, that should be currently checked out, is gub-dsapce-10.1.
