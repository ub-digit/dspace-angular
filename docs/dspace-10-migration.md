# GUPEA migration report: DSpace Angular 8 → 10.1

Analysis date: 16 November 2026  
Repository revision: `ed5d8ce58`

**The customization is relatively contained: 88 tracked files differ from the latest upstream commit incorporated into this fork.** Most migration work concerns the GUPEA theme, metadata rendering and deployment tooling. Two submission resolvers contain a workaround that should be reassessed before porting.

The original assessment below describes the 8.x source branch. The phase progress sections record subsequent work on `gub-dspace-10.1`; unchecked acceptance items remain outstanding.

## Frontend migration continuation — 18 November 2026

The source comparison uses the incorporated upstream 8.x baseline
`f9c2f3c86`, the GUPEA source branch `gub-dspace-8_x`, and the exact
`dspace-10.1` tag. The original snapshot at `ed5d8ce58` differs from the
8.x baseline in 88 files. The source branch now differs in 90 files because
it also carries the repository guidelines and this report.

| Area | 10.1 implementation and comparison decision |
|---|---|
| Home news | The 8.x GUPEA override replaced the stock promotional copy and image. The GUPEA 10.1 override uses the target layout and stylesheet, retains localized site CMS content when supplied, and uses the institutional banner and translated introduction as fallback. |
| Footer | The 8.x GUPEA template omitted the top section and attempted to hide the cookie, privacy and agreement links. The base lifecycle reset the cookie flag and the other two subclass properties were misspelled. The target supports the intended visibility via `info`; adopting those flags also disables the cookie popup. The stock footer preserves accessibility, authorized feedback and configured COAR Notify links. |
| Communities | Upstream 10.1 already hides the gear. The GUPEA 8.x template also suppressed pagination and its detail. Retain the target paginator, count and RSS input so all communities remain accessible at page size 20. |
| Item pages | The 8.x changes were six extra fields and embedded URL links for constituent articles. GUPEA overrides the target's untyped and full item templates and inherits their behavior. The target metadata renderer has an opt-in linkification input that preserves controlled vocabulary precedence, language, separators and the stock rendering paths. On the simple item page, the GUPEA template enables it explicitly for the `dc.relation.haspart` field. Full metadata displays complete keys and uses their final segments as the accessible names of the row headers. Embedded links open in the same tab. The stock custom-theme pipe import is unnecessary. |
| Logos and thumbnails | The 8.x logo override removed forced scaling and changed the SVG fallback. The GUPEA stylesheet enables intrinsic logo sizing with a 250px cap and uses the proportional SVG fallback from GUPEA 8.x. The 10.1 thumbnail component has no missing-placeholder option, so GUPEA omits its placeholder branch while preserving the target image and loading states. Item grid overrides drop thumbnail markup for both search results and direct item collections. The stock badge defaults remain because global suppression also hides access and workflow status. |
| Translations | Merged the changed English keys, institutional OIDC wording and Swedish deltas into the 10.1 files. Retained improved upstream Swedish wording; updated compatible Swedish fallback strings where 8.x supplied translations, including related subscription text with target interpolation intact. Omitted removed keys and preserved newer wording where parameters or meaning changed. Both languages add the eight GUPEA homepage/metadata keys. Restored the 8.x Python workflow and snapshots for generating reviewable candidates from original-language comments. The updater skips entries with changed interpolation parameters. |
| Modal width | Set the GUPEA Bootstrap 5 medium dialog maximum width to 95%, matching 8.x. |
| Login and submission | 10.1 discovers backend-advertised methods and exposes an optional per-view method exclusion. Keep advertised methods available until GU confirms the administrative login policy and OIDC deployment. Keep stock workspace/workflow caching pending reproduction of the 8.x loading problem on an authenticated GUPEA 10.1 backend. |
| Siteimprove | The 8.x browser entry point loaded the vendor script on every production page without consulting the consent service. The 10.1 Orejime configuration has no Siteimprove integration and the GUPEA footer settings disable its popup. Activation requires the institutional consent, withdrawal and SPA tracking behavior to be confirmed. |
| Container tooling | Stock 10.1 production Dockerfile already uses Node 22, `npm ci` and exec-form PM2 commands. The GUPEA development image uses Node 22, npm lockfile caching and an explicit entrypoint; external Compose configuration was unavailable. Mount project source at `/app` and use a writable `/cache`; ensure `/app/node_modules` is absent or linked to `/cache/node_modules` to use the image cache. Updated institutional script tags to 10.1 and chose `release-2026.11.002` as the local migration label. Avoid using the malformed untracked alternate Dockerfile or applying the old metadata patch. |

Implementation and code-level verification are separate from institutional
acceptance. The REST endpoint still points to the public sandbox. No institutional
test backend, authentication policy, production Compose overrides
or GUPEA records were available in the repository. Verify the metadata registry
and forms, actual records and search sorting, English/Swedish switching,
screen-reader announcements, banner and logo layout, links and access badges,
keyboard and mobile navigation, OIDC and administrator access, and repeated
authenticated submission/workflow navigation in the institutional environment.

### Continuation validation — 18–19 November 2026

- Full lint passed with 0 errors and 1,505 repository warnings. Angular
  application template/type checking passed with `ngc -p
  tsconfig.app.json --noEmit` under Node 22.23.5.
- Parsed both merged JSON5 files. English changes 14 existing values, Swedish
  changes 202, and each adds eight keys. Every original 10.1 key and its
  interpolation parameters are present in the merge.
- Production browser and SSR compilation passed under Node 22.23.5 with
  `CI=true NG_BUILD_MAX_WORKERS=2 NODE_OPTIONS=--max-old-space-size=8192`.
  The emitted initial server bundle is 8.32 MB. Browser compilation emitted
  `gupea-theme.css` (405.06 kB) with the GUPEA logo sizing rule. Verified all configured head-tag targets and
  compared the six emitted banner images byte for byte with the source assets.
  The 3.49 MB initial browser bundle still exceeds the existing 3 MB warning
  budget. Sass deprecation and unused stock theme warnings remain.
- The focused Karma/Chromium run passed **20/20** tests. Coverage includes the
  GUPEA header, link punctuation/query strings and escaping, opt-in metadata
  rendering with repeated values and language, and both stock resolver specs.
  Resolver specs use mocked services. Karma required local port access and
  `--source-map=false` for the target test builder.
- Bash syntax and release-tag checks passed. The build wrapper issued both
  expected image builds from the repository root. A stub Docker command
  verified that a failed build stops the combined build/push script before any
  push. The Node 22 development image built with `npm ci` using a local
  validation tag. A disposable network-disabled container verified the cached
  manifest hashes, dependency symlink and Angular package resolution.
  The default development command compiled and served the GUPEA stylesheet.
  The cold compile exceeded the first smoke-test timeout and passed on retry
  with a longer startup window. A shell test with a stub npm command verified cache hits, lockfile changes,
  failed-install invalidation and retry. Dependency installation reported 95
  audit findings on the inherited lockfile. The production image also built
  with the stock 4 GB Node heap limit and rendered both languages against the
  local 10.1 REST API. The production image was built before the last Swedish
  wording corrections. The later browser/SSR build validated those final
  catalogs from a stable source snapshot.
- The configured public REST endpoint reported `DSpace 11.0-SNAPSHOT`. For
  version-matched smoke tests, a temporary loopback-only Compose stack used
  the stock 10.1 test backend and stock 10.1 distribution frontend. The local
  backend reported `DSpace 10.1` and returned valid HAL, and the stock frontend
  rendered its home page with SSR state. The migrated SSR build also returned the
  GUPEA home page with logo, banner, stylesheet, accessibility link and both
  language variants. Swedish verification initially exposed a hash mismatch
  because the catalog was edited during the first build. The final rebuild
  emitted matching browser and server catalogs, and the Swedish SSR check
  passed. Test endpoint overrides were process-local. Institutional data, login
  and workflows still require GUPEA integration testing.
  [Backend release images](https://hub.docker.com/r/dspace/dspace/tags)
  [Frontend release images](https://hub.docker.com/r/dspace/dspace-angular/tags)
- Chromium verified desktop navigation, mobile menu expansion, both directions
  of language switching, and access to the 21st sample community on page 2.
  Chromium selected the desktop and mobile WebP banner sources and activated
  the focused mobile menu button with Space. A 175 × 180 px community
  logo retained its intrinsic width, and a browser image error rendered
  the stock proportional SVG fallback. Cross-device visual and screen-reader
  review remain open.
  These checks used the isolated stock 10.1 backend with generated test data.
  Chromium also signed in with a local test administrator, opened the stock
  workspace form, refreshed it, left and returned, and opened and refreshed
  the stock workflow form after a successful fixture deposit. This supports
  retaining the stock resolvers. GUPEA submission forms, users and workflow
  policies still need institutional testing.
- SSR against an archived fixture verified all six simple-page fields, both
  article URLs, repeated-value separators, escaped markup, linkification
  limited to constituent articles, no missing-thumbnail placeholder, and full
  metadata row headers. The fixture uses test definitions of the three
  `dc.gup.*` fields. Chromium found the item in list and grid views, verified
  their item-link targets, and confirmed the grid card has no thumbnail element. The home page showed the five newest of six
  archived fixtures in descending accession order.

## Phase 2: header and navigation — 18 November 2026

Selected group: the header, header/navbar wrapper and public navbar identified
as the next phase after theme infrastructure. No other migration group was started.

Three-way comparison:

- Compared `gub-dspace-8_x:src/themes/gupea/app/{header,header-nav-wrapper,navbar}`
  with the corresponding stock theme directories at upstream baseline
  `f9c2f3c86`, and with `dspace-10.1` / the current target's stock theme.
- **The only local component customization in these three directories is the
  header logo URL.** The wrapper/navbar TypeScript, templates and styles, and
  header TypeScript/styles, are byte-identical to upstream 8.x. The inventory's
  descriptions of copied navigation code should not imply institution-specific
  functionality that needs to be recreated.
- Upstream 10.1 introduces Angular control flow, Bootstrap 5 spacing and header
  flex-layout changes. These are retained, along with all current controls,
  including context help (already present upstream in 8.x). No obsolete 8.x
  wrapper/navbar code or redundant lifecycle implementation was copied. The
  target also moves navbar item styling out of the wrapper; inheriting the current
  components avoids restoring obsolete Bootstrap 4 padding/style rules.

Implementation:

- Added the GUPEA header as a subclass of the **10.1 themed DSpace header**,
  reusing its lifecycle/menu behavior and referencing its existing stylesheet.
  Its template is the current 10.1 header with only the logo path changed to
  `assets/gupea/images/gupea-logo.svg`.
- Registered the header in GUPEA's eager component list. Keep the DSpace parent
  eager list because it still supplies the wrapper, navbar and home-news.
- Deliberately retain wrapper/navbar through `extends: dspace` rather than add
  identical overrides. This preserves mobile animation, dynamic menu sections,
  authenticated mobile user menu and the current accessibility attributes.
- Kept the existing English/Swedish generic repository-logo alternative text and
  translated home-link label. No new or changed translation keys are required.
- Added focused tests for logo/home link, desktop navigation and all five header
  controls (including context help), mobile expansion ARIA state and delegation
  of toggling to the public menu service. Child controls are isolated in these
  tests; their real authentication/language/menu integrations need runtime review.
- Updated the theme README. Core components, global configuration and assets are
  unchanged; no Git commits were created. Existing untracked local files were
  left untouched, including `test2`, present at the start of this resumed turn.

Validation:

- Application TypeScript check passed with Node 22.23.5:
  `tsc --project tsconfig.app.json --noEmit --pretty false`.
- Targeted ESLint passed for the header implementation, template, spec and eager
  registration with no lint findings (`ESLINT_USE_FLAT_CONFIG=false`). The tool
  reports the target's existing legacy-config deprecation warning.
- Focused Karma/Jasmine tests passed: **4/4** in headless Chromium 144, exit 0.
  Command (Node 22 on `PATH`, outside the sandbox):
  `CI=true NG_BUILD_MAX_WORKERS=2 CHROME_BIN=/usr/bin/chromium node_modules/.bin/ng test --watch=false --configuration test --source-map=false --browsers=ChromeHeadless --include=src/themes/gupea/app/header/header.component.spec.ts`.
  Log: `/tmp/gupea-phase2-tests.log` (temporary, untracked).
- Production browser build passed, emitting `gupea-theme.css` (404.97kB).
  Initial browser bundle: 3.47MB; the existing 3MB warning budget is exceeded by
  471.82kB. Sass deprecations and unused stock-custom-theme compilation warnings
  remain. Production SSR build also passed (initial server bundle 8.29MB).
  The full command exited 0, using Node 22.23.5/npm 10.9.4:
  `CI=true NG_BUILD_MAX_WORKERS=2 NODE_OPTIONS=--max-old-space-size=8192 npm run build:prod`.
  Browser/server compilation took approximately 415s/320s; the browser build ran
  concurrently with focused tests. Log: `/tmp/gupea-phase2-build.log` (untracked).
- Three-way scope assertions passed: the 8.x GUPEA wrapper/navbar trees match
  upstream 8.x; the new header template matches 10.1 except for its logo URL.
- `git diff --check` passed. No full lint rerun was needed for this small theme
  change; targeted lint and the production/test compilers covered the changed files.
- Test tooling issues: the target Karma configuration's `sourceMap.hidden` is
  rejected by the current test builder; `--source-map=false` bypasses it without
  changing project files. Karma's port binding is prohibited in the sandbox, so
  tests passed outside it. Production uses `CI=true` to bypass the
  pre-existing unwritable Angular cache, with two workers and an 8GB heap.

Outstanding acceptance: actual mobile/desktop layout, keyboard navigation,
search, language switching, login/impersonation and SSR initial rendering against
an institutionally configured 10.1 backend. The configured REST endpoint remains
`https://sandbox.dspace.org/server`; unit tests do not contact it. No authenticated
backend interaction or live-site testing was performed in this phase.

## Phase 1: theme infrastructure — 17 November 2026

Source: `gub-dspace-8_x`; target: `gub-dspace-10.1`. The target's application,
package manifest and stock theme match the local `dspace-10.1` tag before this
phase (the branch also adds migration documentation). The branch name in the
repository instructions contains a typo; the actual target is `gub-dspace-10.1`.

Completed:

- Created `src/themes/gupea` from the **10.1** Sass pipeline and component-list
  conventions. No 8.x theme NgModules or component implementations were copied.
- Registered GUPEA eager/listable lists, intentionally empty until component work.
  GUPEA explicitly extends `dspace`; the stock registrations remain necessary to
  supply the current header, navbar, wrapper and homepage. Missing overrides
  continue to fall back through the standard loader to core components.
- Registered the non-injected `gupea-theme` CSS bundle and activated GUPEA with
  CSS prefetch and institutional favicon/manifest head tags. Parent component
  inheritance does not load parent CSS: GUPEA builds a complete stylesheet itself.
- Ported GU blue, Nunito typography, links, tables, breadcrumbs, header dimensions,
  banner/navbar/image variables and search filter/settings styles. Included the
  250px community/collection logo maximum in theme variables, leaving core intact.
- Used Bootstrap 5's semantic-color map extension, contrast-ratio setting,
  `$table-striped-bg` and `.badge.bg-secondary`. Changed the mobile Sass breakpoint
  to `media-breakpoint-down(md)` to preserve the 8.x coverage below 768px.
  Core global styles are imported once in the theme bundle.
- Copied the logo, all six responsive banner images, browser/device icons and
  manifest byte-for-byte. Existing webpack asset discovery requires no changes.
  Retained Google Fonts for Nunito; no font binaries were present on the source.
- Ported the five recent submissions, accession-date sort, community page size 20,
  disabled homepage discovery filters, and English/Swedish language selection.
  Kept the existing sandbox REST endpoint; institutional deployment configuration
  and backend compatibility remain separate tasks.

Decisions and work remaining at the phase 1 handoff:

- Custom header, wrapper, navbar, footer, home-news and community-list overrides
  are **deferred**, as are item/metadata overrides and all core modifications.
  The parent theme's stock logo and homepage remain visible for now; copying the
  institutional assets alone does not activate their component presentation.
- Keep normal 10.1 community pagination in this phase. The page size is 20, but
  the old override that hid pagination was not ported, so more communities remain
  reachable. Verify with a matching backend and more than 20 communities.
- Do not restore the 95% default modal width without checking current dialogs.
  Keep Bootstrap's target default for now. Bootstrap 4's YIQ threshold was replaced
  with a contrast ratio of 4.5; review resulting button/badge colors visually.
- Omit `create-favicons.sh`: its required source `logo.png` is missing. The existing
  generated icons and manifest are retained; their relative icon references resolve
  within `assets/gupea/images/favicons/`.
- Full translation deltas, homepage copy, footer visibility, authentication,
  analytics, resolver workarounds and Docker migration remain later phases.
- The untracked `Dockerfile.dist.memoryfix` and `test` were present before this work
  and were left untouched. No Git commits were created.

Validation evidence:

- Locked dependencies installed with `npm ci --ignore-scripts --no-audit --no-fund`
  (a temporary npm cache was used). Initial sandbox registry DNS failure required
  network approval. Installation used the initially active Node 26/npm 12 and
  reported the expected project engine warning. No lockfile changes were made.
- Installed temporary Node **22.23.5** and npm **10.9.4** under `/tmp`, without
  changing the repository runtime configuration, for supported build validation.
- `npm run build:lint` passed. Targeted ESLint passed for all four added/changed
  TypeScript registration files under Node 22, using `ESLINT_USE_FLAT_CONFIG=false`
  because this target still supplies `.eslintrc.json`. ESLint reports its existing
  legacy-configuration deprecation warning.
- The full GUPEA Sass pipeline compiled using Sass's JS API and a tilde importer
  equivalent to webpack's resolution. Direct Sass CLI invocation cannot resolve
  the target's existing `~node_modules` Font Awesome imports. Compilation reports
  upstream Sass deprecations, but no theme compilation errors.
- Parsed the resulting CSS and verified GU blue, the 250px logo maximum, supported
  item-image variables, 60px/70px logo heights at the 768px breakpoint, and the
  Bootstrap 5 facet badge rule.
- Parsed Angular build configuration, YAML and the web manifest; verified GUPEA
  selection/inheritance/prefetch, the non-injected bundle, homepage/language
  settings, every favicon head-tag target and both manifest icon paths.
- All 13 migrated asset files match `gub-dspace-8_x` byte-for-byte.
- `git diff --check` passed. No new unit specs were added: this phase introduces
  configuration, styles and static assets, with no component behavior changes.
- Application type-check passed under Node 22:
  `tsc --project tsconfig.app.json --noEmit --pretty false`.
- Full `npm run lint` passed (0 errors, 1,505 repository warnings). This full run
  used the initial Node 26 runtime; the targeted registration-file lint also
  passed under supported Node 22. No core lint cleanups were included.
- Initial `npm run build:prod` under Node 22/npm 10 failed with `EACCES` while
  creating `.angular/cache/20.3.36`; the existing cache directory is not writable
  in the sandbox (the legacy cache is owned by `nobody:nogroup`). The first
  outside-sandbox retry was stopped before completion to bypass this cache.
  Validation is being retried with `CI=true`, which disables Angular's local
  persistent cache, two build workers and an 8GB heap, without project changes.
  The browser production build passed and emitted `gupea-theme.css` (404.97kB)
  and all 13 theme assets; emitted assets were checked byte-for-byte. Its initial
  bundle is 3.47MB, above the 3MB warning budget (not an error). The build also
  reports Sass deprecations and unused stock-custom-theme compilation warnings.
  The SSR production build also passed (initial server bundle 8.28MB).
  Full command: `CI=true NG_BUILD_MAX_WORKERS=2 NODE_OPTIONS=--max-old-space-size=8192 npm run build:prod`
  with the temporary Node 22/npm 10 runtime on `PATH`. Exit status was 0.
  Browser and server builds took approximately 326s and 309s, respectively.
  Build log: `/tmp/dspace-migration-build-ci.log`; lint log:
  `/tmp/dspace-migration-lint.log`. These temporary logs are not tracked.
  The original cache failure did not identify theme source errors.

No browser/SSR runtime session or backend integration checks were performed.
The above static asset/configuration checks do not verify deployed URLs, language
switching, banner cropping or the sandbox backend's search configuration.

The header/navigation follow-on is now recorded in phase 2 above. Home-news,
footer and community-list presentation remain later work; merge only the
translation keys needed by each change. Runtime validation still requires SSR
and responsive-layout checks against a matching 10.1 backend.

## Scope and comparison baseline

The application identifies itself as `8.3.0-next`, using Angular 17 and Bootstrap 4.6. Its history includes DSpace 8.2 and subsequent upstream 8.x changes through:

```text
f9c2f3c86 — 2025-10-13 — Merge pull request #4773
```

That commit is the merge base between the analyzed checkout and the locally available `upstream/dspace-8_x`. The customization inventory uses:

```bash
git diff f9c2f3c86 HEAD
```

Comparing only against `dspace-8.0` or `dspace-8.2` would incorrectly classify numerous upstream fixes, dependency updates, translations and authorization improvements as local customizations.

The working tree also contained two untracked files, discussed separately below.

Target compatibility was checked against official DSpace documentation, the published 10.1 package manifest, and locally available upstream 10.x source. **The local 10.x branch is supporting evidence, not an exact substitute for the 10.1 tag.** Migration classifications are estimates from static inspection.

## Classification

| Code | Meaning |
|---|---|
| **Direct** | Content, assets or settings can largely be retained. |
| **Adapt** | Preserve the purpose, but update Angular, Bootstrap, DSpace integration or deployment code. |
| **Reassess** | The change may be unnecessary, superseded, inactive or better replaced by configuration. |

Difficulty is relative: **Low** means a small isolated change; **Medium** involves framework integration or several components; **High** involves behavior that needs investigation and integration testing.

## Target changes affecting this repository

DSpace 10.1 uses Angular 20, TypeScript 5.9 and Bootstrap 5.3. Its manifest specifies Node `>=20 <25` and npm as its package manager. The local Node 18/Yarn Docker setup therefore needs adaptation. [10.1 package manifest](https://raw.githubusercontent.com/DSpace/dspace-angular/dspace-10.1/package.json)

The documented upgrade path also calls for Angular control-flow templates, Bootstrap 5 styling, and updated theme registration. The existing custom components are already standalone, so their main architectural work is updating templates, imports and registration. [DSpace upgrade guide](https://wiki.lyrasis.org/spaces/DSDOC10x/pages/408944710/Upgrading+DSpace)

DSpace 10 replaces theme module registration with component lists, including `eager-theme-components.ts` and `lazy-listable-components.ts`. [Theme customization guide](https://wiki.lyrasis.org/spaces/DSDOC10x/pages/408944957/User+Interface+Customization)

## 1. GUPEA theme and component overrides

All paths in this section are under `src/themes/gupea`.

| Customization | Purpose and dependencies | Migration classification |
|---|---|---|
| `app/header/header.component.{ts,html,scss}` | GUPEA SVG logo, desktop navigation, search, language switch, authentication, impersonation and mobile toggle. Extends the core header and uses its menu service and responsive observables. | **Adapt · Medium.** Reapply the layout to the 10.1 header; update imports, control flow and Bootstrap utilities. Verify keyboard and mobile navigation. |
| `app/header-nav-wrapper/header-navbar-wrapper.component.{ts,html,scss}` | Wraps the header and animated mobile menu, with customized spacing, borders and responsive layout. Depends on the core wrapper, themed header/navbar and slide animation. | **Adapt · Medium.** Compare with the target wrapper before retaining copied markup and animation bindings. |
| `app/navbar/navbar.component.{ts,html,scss}` | Displays dynamically supplied menu sections and the authenticated mobile user menu. Depends on core navbar state, dynamic component injectors and themed user menu. | **Adapt · Medium.** Check the target menu-section API and Bootstrap classes. |
| `app/footer/footer.component.{ts,html}` | Customized bottom footer retaining attribution, optional information links and COAR Notify support. Reuses core footer styles and behavior. | **Adapt / Reassess · Low–Medium.** Rebuild from the target footer and carry over the intended visibility choices. See the flag errors below. |
| `app/home-page/home-news/home-news.component.{ts,html,scss}` | GUPEA title, translated introduction and responsive banner imagery. Depends on translation keys and theme images. | **Adapt · Low–Medium.** Copy content and images; update obsolete Bootstrap markup such as `jumbotron` and confirm responsive behavior. |
| `app/home-page/top-level-community-list/top-level-community-list.component.{ts,html}` | Removes pagination controls, pagination detail and the settings gear from the homepage community list. Uses the core community observable and collection component. | **Adapt · Low–Medium.** Confirm the target collection inputs. With pagination hidden and page size 20, additional communities may be inaccessible from this list. |
| `eager-theme.module.ts` | Lists the six GUPEA overrides for early loading. | **Adapt · Medium.** Replace with target-style component-list registration. |
| `lazy-theme.module.ts` | Copied module scaffolding with no custom declarations and numerous framework imports. | **Reassess · Low.** Replace with the 10.1 scaffolding; do not retain obsolete module imports. |
| `styles/theme.scss` | Assembles theme styles. | **Adapt · Low.** Start from the target theme entry point and retain custom overrides. |
| `styles/_theme_sass_variable_overrides.scss` | GU blue and supporting colors, Nunito typography, links, tables, navbar colors, breadcrumb colors and a 95% medium-modal width. Depends on Bootstrap Sass and Google Fonts. | **Adapt · Medium.** Review Bootstrap 4 variables such as `$yiq-contrasted-threshold` and `$table-accent-bg`; verify the unusually wide modal setting against target dialogs. |
| `styles/_theme_css_variable_overrides.scss` | Logo/header dimensions, banner shading, navbar border and item-image sizing. Depends on DSpace CSS variables and Sass breakpoints. | **Adapt · Low–Medium.** Retain supported variables and check renamed or unused ones. |
| `styles/_global-styles.scss` | Search facet/settings backgrounds, padding, heading sizes and badge colors. Imports core global styles. | **Adapt · Medium.** Check target selectors and Bootstrap badge classes; avoid duplicating target global styles. |

### Theme integration findings

`angular.json` replaces the stock `dspace-theme` stylesheet entry with `gupea-theme`. `config/config.yml` activates GUPEA.

However, `src/themes/eager-themes.module.ts` still imports the stock DSpace eager module. The GUPEA eager module is not registered there. This does not by itself prove that GUPEA overrides never load, but it means the intended eager-loading integration is incomplete.

The footer declares:

```typescript
showCookieSettings = false;
showPrivatePolicy = false;
showEndUserAgreerment = false;
```

Its template reads `showPrivacyPolicy` and `showEndUserAgreement`. The latter two declarations therefore do not control those template conditions. Migration should establish the intended link visibility rather than preserve these spelling errors.

## 2. Direct modifications to application components

These changes affect the base application, potentially beyond the GUPEA theme.

| Files | Purpose and dependencies | Migration classification |
|---|---|---|
| `src/app/item-page/simple/item-types/untyped-item/untyped-item.component.html` | Adds ISBN, series, constituent articles, department, defence location and opponent to the simple item page. Uses generic field components and local translations. | **Adapt · Low–Medium.** Apply through a GUPEA item override where supported. Backend metadata must expose the same fields. |
| `src/app/shared/utils/linkify-pipe.ts` | New standalone pipe converting embedded HTTP(S) URLs into anchors while escaping surrounding text. Depends on `DomSanitizer` and returns trusted HTML. | **Adapt · Medium.** Preserve the feature, but review URL parsing, escaping and the need to bypass Angular sanitization. |
| `src/app/item-page/field-components/metadata-values/metadata-values.component.{ts,html}` | Adds `enableLinkify`; linkified rendering takes precedence over Markdown and existing link rendering. | **Adapt · Medium.** Integrate with the target metadata renderer without overwriting its newer behavior. |
| `src/app/item-page/simple/field-components/specific-field/item-page-field.component.html` | Enables linkification when the sole requested field is `dc.relation.haspart`. | **Adapt · Low–Medium.** Keep coordinated with the pipe and metadata renderer. |
| `src/app/item-page/full/full-item-page.component.{ts,html}` | Linkifies `dc.relation.haspart` on the full metadata page. Adds `getLastPart()` and an ARIA label so screen readers announce only the final metadata-key segment. | **Adapt · Medium.** Retain target metadata handling and assess whether shortened labels remain understandable and distinct. |
| `src/themes/custom/app/item-page/full/full-item-page.component.ts` | Imports `LinkifyPipe` into the stock custom-theme full item component. | **Reassess · Low.** GUPEA is the configured theme. This is a companion import rather than a separate rendering feature; omit unless that component is needed. |
| `src/app/shared/comcol/comcol-page-logo/comcol-page-logo.component.{ts,html}` | Removes forced full-width logo scaling and changes the fallback SVG sizing/aspect behavior. | **Adapt · Low.** Prefer a theme override or CSS solution; test small logos and failed-image fallback. |
| `src/styles/_custom_variables.scss` | Reduces `--ds-comcol-logo-max-width` from 500px to 250px globally. | **Direct · Low.** Move the value into GUPEA’s CSS variable overrides if the target still supports it. |
| `src/app/thumbnail/thumbnail.component.html` | Removes the “no thumbnail” placeholder while retaining actual images and loading behavior. | **Adapt / Reassess · Low.** Check for a target configuration option; otherwise use a theme override. |
| `src/app/shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.html` | Removes thumbnails from item grid cards, including linked and unlinked variants. | **Adapt · Low–Medium.** Reapply to the target card template, preserving current accessibility and navigation behavior. |
| `src/app/shared/object-collection/shared/listable-object/listable-object-component-loader.component.ts` | Changes `showLabel` default from `true` to `false`, suppressing badges wherever callers rely on the default. | **Reassess / Adapt · Medium.** Prefer explicit inputs at intended call sites. The global default can also affect status and access badges. |
| `src/app/shared/log-in/log-in.component.ts` | Filters password authentication out of the displayed authentication-method list. Depends on `AuthMethodType.Password` and authentication state. | **Reassess / Adapt · Medium.** Check target configuration and backend authentication policy first. This hides a UI method; it does not disable password authentication in the backend. |
| `src/app/workspaceitems-edit-page/workspace-item-page.resolver.ts` | Changes the first boolean argument to `findById()` from `true` to `false`. Commit `552b3dae6` identifies it as an infinite-loading workaround. | **Reassess · High.** Test stock 10.1 submission editing first. If still needed, investigate current cache/request semantics before reproducing it. |
| `src/app/workflowitems-edit-page/workflow-item-page.resolver.ts` | Applies the same workaround to workflow-item resolution. | **Reassess · High.** Test workflow editing, transitions, refreshes and repeat visits against the upgraded backend. |
| `src/main.browser.ts` | Loads Siteimprove script `siteanalyze_7340.js` once in production. Depends on the external analytics service and browser DOM. | **Adapt · Medium.** Integrate with the target browser bootstrap and existing consent behavior; verify SPA navigation tracking and duplicate prevention. |

### Metadata dependency inventory

The added item fields are:

```text
dc.identifier.isbn
dc.relation.ispartofseries
dc.relation.haspart
dc.gup.department
dc.gup.defenceplace
dc.gup.opponent
```

The `dc.gup.*` fields create a dependency on the institution’s backend metadata registry and content conventions. This frontend repository does not establish whether those backend definitions, submission forms or import mappings will remain unchanged.

Linkification spans several components. Porting only the pipe or only the template input would leave the feature incomplete.

## 3. Configuration changes

All local configuration changes are in `config/config.yml`.

| Setting | Purpose and dependencies | Migration classification |
|---|---|---|
| `themes: gupea` | Activates institutional branding. Depends on theme discovery, styles and assets. | **Adapt · Medium**, coordinated with target theme registration. |
| Theme `headTags` | Supplies ICO/SVG favicons, Apple touch icon and web manifest. | **Direct · Low**, verifying deployed asset URLs. |
| `homePage.recentSubmissions.pageSize: 5` | Limits recent submissions. | **Direct · Low**, subject to target schema validation. |
| `homePage.recentSubmissions.sortField: dc.date.accessioned` | Sorts recent submissions by accession date. Depends on backend search configuration. | **Direct · Low.** |
| `homePage.topLevelCommunityList.pageSize: 20` | Enlarges the initial community list. | **Direct · Low**, but review alongside hidden pagination. |
| `homePage.showDiscoverFilters: false` | Hides homepage discovery filters. | **Direct · Low**, subject to target schema validation. |
| Active languages restricted to English and Swedish | Limits language choices. Depends on corresponding translation files. | **Direct · Low.** |

The committed REST endpoint remains the upstream sandbox default; it is not an institutional endpoint customization. Production configuration may be supplied through deployment files or environment variables outside this repository.

## 4. Translations and translation tooling

| Customization | Purpose and dependencies | Migration classification |
|---|---|---|
| `src/assets/i18n/en.json5` | Replaces selected DSpace references with Gupea; changes OIDC text to “Sign in with GU account”; adds homepage copy and six metadata labels. | **Direct / Adapt · Low.** Apply the changed keys to target translations, resolving renamed keys. |
| `src/assets/i18n/sv.json5` | Extensive Swedish completion and terminology changes across navigation, administration, submissions, subscriptions, access control and other screens; GUPEA branding, login wording and new local labels. | **Adapt · Medium.** Compare each local translation with 10.1 to retain useful work without replacing improved upstream translations. |
| `gub_i18n/i18n/{en,sv}.json5` | Additional translation source snapshots used by local tooling. | **Reassess · Medium.** Treat as translation resources, not replacement target language files. |
| `gub_i18n/update_translations.py` | Copies translations into matching existing keys, primarily when the target remains equal to its original-English comment. Writes a `.updated` output file. | **Adapt / Reassess · Medium.** Its comment-dependent matching does not provide a general translation merge and does not introduce missing keys. Check compatibility with target files. |
| `gub_i18n/replacements`, `skip_words` | Rebrands `Chalmers ODR`, `ODR` and `DSpace` to Gupea; skips source values containing `chalmers`. | **Reassess · Low.** Confirm that broad replacements remain appropriate for current source material. |
| `gub_i18n/run_update_translations.sh`, `setup-python.sh`, `.tool-versions`, `requirements.txt`, README and `.gitignore` | Python/asdf environment and execution support. Depends on Python and `json5`. | **Direct / Adapt · Low.** Retain only if the translation workflow remains useful. |

The English file has 26 added/14 removed lines; Swedish has 212 added/202 removed lines relative to the identified baseline. These are textual diff counts, not counts of independent features.

**Do not copy the complete 8.x translation files over 10.1.** Preserve local wording as a delta and retain target keys, interpolation parameters and upstream corrections.

## 5. Assets

All added assets are under `src/themes/gupea/assets`.

| Assets | Purpose and dependencies | Migration classification |
|---|---|---|
| `images/gupea-logo.svg` | Institutional header logo. | **Direct · Low.** |
| `images/banner.jpg`, `banner-half.jpg`, `banner-tall.jpg` and matching WebP files | Responsive homepage photography. Depends on the home-news template and CSS. | **Direct · Low.** Retest cropping at target breakpoints. |
| `images/favicons/favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` | Browser and device icons. | **Direct · Low.** |
| `images/favicons/manifest.webmanifest` | Gupea name, device icon references, colors and standalone display setting. | **Direct · Low.** Verify relative icon paths after deployment. |
| `images/favicons/create-favicons.sh` | Generates raster icons using ImageMagick’s `magick` command. | **Direct / Reassess · Low.** Its expected `logo.png` source is not present in this asset directory. Existing generated icons can migrate independently. |
| Font/image `.gitkeep` files | Directory placeholders. | **Reassess · Trivial.** No runtime behavior. |

Nunito is loaded from Google Fonts rather than bundled in the theme. That external dependency should be retained deliberately or replaced with locally hosted font files.

The stock `src/themes/dspace` banner changes visible against the 8.2 release are inherited upstream changes, not local GUPEA customizations.

## 6. Docker and development tooling

| Files | Purpose and dependencies | Migration classification |
|---|---|---|
| `Dockerfile` | Changes the command to Docker’s JSON exec form. | **Direct / Reassess · Low.** Retain if the target Dockerfile does not already provide equivalent behavior. |
| `Dockerfile.dist` | Sets an 8GB build heap, uses frozen Yarn installation and JSON-form PM2 command. | **Adapt · Medium.** Start from the 10.1 Dockerfile; update Node/package-manager assumptions and measure required build memory. |
| `Dockerfile.dev` | Adds a multistage Node 18 development image with preinstalled dependency cache and a development startup command. | **Adapt · Medium.** Update the runtime and dependency workflow. |
| `docker-entrypoint.dev.sh` | Hashes dependency manifests, refreshes cached modules and links them into `/app`. Depends on Bash, Yarn, cache volumes and filesystem layout. | **Adapt / Reassess · Medium.** The Dockerfile copies this script but does not itself declare it as `ENTRYPOINT`; external Compose configuration may activate it. Verify that integration before retaining it. |
| `docker/build/build*.sh`, `push*.sh`, `image_names.sh` | Builds and pushes development/production images to `docker.ub.gu.se`. Assumes execution from the build-script directory. | **Adapt · Low–Medium.** Update `dspace-8_x` image naming, build commands and release conventions. |
| `docker/build/.env` | Institutional release identifier, currently `release-2026.11.001`. | **Direct · Low**, with a new migration release value. |
| `docker/build/.gitignore` | Local build-tool exclusions. | **Direct · Low.** |
| `.dockerignore` | Excludes Angular cache and attempts to exclude a local translation directory. | **Adapt · Low.** It spells that directory `gup_i18n`, while the actual directory is `gub_i18n`; correct the exclusion if intended. |

There are **no local changes to `package.json` or `yarn.lock` relative to the actual incorporated upstream baseline**. Dependency differences against the 8.2 release are upstream maintenance changes.

Likewise, apparent changes to `server.ts`, CI, authorization selectors and submission-form internals against older tags are not local customization work.

## 7. Untracked local files

| File | Finding | Migration treatment |
|---|---|---|
| `Dockerfile.dist.memoryfix` | Alternate distribution Dockerfile, largely duplicating the committed memory adjustment. Its `NODE_OPTIONS` line has an unmatched opening quote. | **Reassess · Low.** Do not use unchanged; preserve only any still-needed build-memory setting. |
| `tmp.patch` | Patch material overlapping the metadata/linkification work already present in tracked files. | **Reassess · Low.** Reference material, not an additional active customization. Do not apply blindly to 10.1. |

## Migration priorities

1. **Establish a clean 10.1 frontend and matching backend.** DSpace requires upgrading both sides; frontend-only testing cannot validate submission and authentication behavior. [10.1 release notes](https://wiki.lyrasis.org/spaces/DSDOC10x/pages/408944700/Release+Notes)
2. **Recreate GUPEA using 10.1 theme scaffolding.** Port the six overrides, styles, assets and configuration; fix eager registration.
3. **Move presentation changes into GUPEA overrides where supported.** Prioritize item fields, thumbnails, logos and grid cards.
4. **Port metadata linkification as one coordinated feature.** Review sanitization and retain target metadata-rendering improvements.
5. **Merge translation deltas.** Preserve target keys and review existing Swedish upstream improvements.
6. **Resolve authentication and analytics integration.** Confirm intended login methods and production tracking behavior.
7. **Retest stock submission/workflow editing before carrying the resolver workaround.**
8. **Update Docker tooling and perform an integration build.**

The highest uncertainty is the resolver workaround. The largest predictable effort is updating theme templates and styling. Assets, institutional copy and most configuration values are straightforward to retain.

## Validation required before acceptance

| Area | Essential checks |
|---|---|
| Theme | Production build, SSR/initial rendering, mobile menu, language switch, keyboard navigation and footer visibility. |
| Homepage | Banner cropping, five recent submissions, sorting and community visibility when the count exceeds 20. |
| Metadata | All six added fields; missing/repeated values; embedded URLs, punctuation and hostile HTML; full-page screen-reader labels. |
| Search | List/grid display, removed thumbnails and intended badge visibility. |
| Authentication | Institutional sign-in, intended password-login availability, logout and administrative access. |
| Submissions | New and resumed submissions, workflow editing, refreshes and repeat navigation without stale data or endless loading. |
| Deployment | Updated Node image, reproducible dependency installation, cache behavior, configuration loading and asset URLs. |

Runtime and visual acceptance checks remain outstanding. Phase 1 validation evidence is recorded above; it does not establish backend or production readiness.

## Migration task checklist

Implementation and reassessment decisions are checked below. Runtime acceptance remains unchecked until verified. For reassessment tasks, completion means recording a decision and its supporting evidence, including when a customization is deliberately omitted.

### Baseline and target environment

- [x] Create an isolated migration branch or checkout based on the exact `dspace-10.1` release.
- [x] Confirm the 88-file customization delta against `f9c2f3c86` and account for any changes made since this analysis.
- [x] Compare affected APIs and templates with the exact 10.1 tag; resolve assumptions based on the local upstream 10.x branch.
- [x] Establish a matching stock DSpace 10.1 backend in a local test environment.
- [ ] Inventory production environment variables, Compose overrides and configuration supplied outside this repository.
- [x] Establish supported Node and npm versions and install target dependencies using the target lockfile workflow.
- [x] Smoke-test the stock 10.1 distribution frontend against the matching stock backend.

### Theme registration and framework migration

- [x] Create GUPEA theme scaffolding from the target release.
- [x] Replace `eager-theme.module.ts` with target-style eager component registration for retained overrides.
- [x] Replace or omit `lazy-theme.module.ts` and configure target listable-component registration as required.
- [x] Register GUPEA in the target global theme component lists; retain the DSpace parent registrations required during phased migration.
- [x] Register `gupea-theme` in `angular.json` and activate GUPEA in runtime configuration.
- [x] Convert custom templates to target Angular control-flow syntax.
- [x] Update component imports and inherited APIs to match 10.1.
- [x] Migrate Bootstrap 4 utility classes and Sass variables to Bootstrap 5 equivalents.

### Theme components and styling

- [x] Port the GUPEA header logo, navigation layout, search and account controls using the 10.1 header.
- [x] Reassess the header/navbar wrapper: inherit 10.1; the 8.x GUPEA copy has no local changes.
- [x] Reassess navbar sections and the mobile user menu: inherit 10.1; no local 8.x changes to port.
- [x] Decide intended footer link visibility and correct the misspelled property names.
- [x] Port the footer while retaining required target footer behavior and COAR Notify support.
- [x] Port homepage title, introduction, banner markup and responsive styles.
- [x] Review community-list presentation and retain the target collection inputs.
- [x] Decide how communities beyond the first 20 remain discoverable when pagination is hidden.
- [x] Port institutional colors, typography, link, table and breadcrumb styles.
- [x] Restore the 95% medium modal width in the GUPEA Bootstrap 5 theme.
- [x] Port supported header, banner, navbar and image CSS variables.
- [x] Update search facet/settings styling and badge selectors.
- [x] Review global-style imports to avoid duplicating target styles.
- [x] Decide whether to retain Google Fonts loading or host Nunito locally.

### Item metadata and accessibility

- [ ] Verify backend registry definitions and content for all six added metadata fields.
- [ ] Verify related backend submission forms and import mappings for `dc.gup.*` metadata.
- [x] Add ISBN to the GUPEA simple item view.
- [x] Add series information to the GUPEA simple item view.
- [x] Add constituent articles (`dc.relation.haspart`) with the intended separators.
- [x] Add department to the GUPEA simple item view.
- [x] Add defence location to the GUPEA simple item view.
- [x] Add opponent to the GUPEA simple item view.
- [x] Review and adapt `LinkifyPipe`, including URL parsing, escaping and sanitizer use.
- [x] Integrate linkification into the target metadata-values renderer.
- [x] Enable linkification for the intended simple-page field only.
- [x] Integrate `dc.relation.haspart` linkification into the full metadata page.
- [x] Restore the final metadata-key segment as the accessible row-header label while retaining the complete visible key.
- [x] Decide whether the companion pipe import under `src/themes/custom` is needed.
- [x] Verify missing, repeated and multiline metadata values in unit tests.
- [x] Verify URL punctuation, query strings, HTML escaping and hostile input handling.
- [ ] Verify full metadata-page screen-reader labels remain understandable and distinct.

### Logos, thumbnails and search results

The 8.x search-grid change (`d66b91367`) removed both thumbnail branches from
the generic item card used for items and publications. Direct item grids also
use that card. The shared thumbnail change (`134829170`) removed the HTML
placeholder for missing images across all callers. Specialized entity cards
and community/collection cards used their own templates in 8.x and still
display available images. In 10.1, the GUPEA grid overrides are registered in
`src/themes/gupea/lazy-listable-components.ts`, and the shared thumbnail
wrapper resolves the GUPEA template through its theme lookup.
The committed target at `ea316ad91` still uses both stock templates. The
GUPEA overrides and their registration are present in the working tree.
Five Chromium regression tests passed, covering registration, linked search
results, unlinked direct items, missing placeholders and available images.

- [x] Implement community/collection logo sizing through target theme or CSS extension points.
- [x] Move the 250px logo-width setting into GUPEA overrides if supported.
- [x] Verify intrinsic logo sizing on 10.1 and restore the GUPEA 8.x failed-image SVG.
- [x] Check for target configuration to suppress missing-thumbnail placeholders; otherwise port a theme override.
- [x] Port thumbnail removal from item grid cards.
- [x] Decide intended badge visibility and replace the global `showLabel` default change with explicit inputs where possible.
- [x] Verify stock list/grid item-link targets and grid thumbnail suppression.
- [ ] Verify list/grid accessibility and status and access badges against institutional records.

### Configuration

- [x] Port and validate favicon and manifest `headTags`.
- [x] Set recent-submission page size to five.
- [x] Verify the five-item limit and accession-date sorting on stock 10.1. Confirm GUPEA search configuration at deployment.
- [x] Port the community-list page size after resolving the pagination decision.
- [x] Disable homepage discovery filters using supported target configuration.
- [x] Verify browser language switching in addition to enabled English and Swedish SSR.
- [ ] Configure the intended test/production REST endpoints using the deployment configuration inventory.

### Translations and translation tooling

- [x] Extract and merge English customization deltas into target translations.
- [x] Review Swedish changes against target upstream translations and merge retained wording.
- [x] Port GUPEA branding and institutional OIDC sign-in wording.
- [x] Port homepage translation keys and copy.
- [x] Port all six added metadata-label keys.
- [x] Resolve renamed/removed keys and verify interpolation parameters.
- [x] Restore the `gub_i18n` source snapshots, local branding rules and Python workflow. Generate reviewable candidates without overwriting the runtime catalogs.
  Ran the updater against copies of both 10.1 catalogs and verified that it
  preserves existing translations, comments and interpolation parameters.

### Authentication, analytics and submission behavior

- [ ] Confirm intended password-authentication policy and administrative access requirements.
- [x] Check target frontend/backend configuration before retaining a UI password-method filter.
- [ ] Implement any remaining login customization using the current authentication API.
- [ ] Verify institutional login, logout and administrative access.
- [ ] Integrate Siteimprove with the target browser startup and existing consent behavior.
- [ ] Verify production-only analytics loading, SPA navigation tracking and duplicate prevention.
- [x] Test stock 10.1 workspace-item resolution before porting the workaround.
- [x] Test stock 10.1 workflow-item resolution before porting the workaround.
- [x] Keep stock caching after workspace and workflow smoke tests passed. Revisit if the GUPEA backend reproduces the loading problem.
- [ ] Verify new/resumed submissions, workflow transitions, refreshes and repeat visits without endless loading or stale data.

### Assets

- [x] Copy the GUPEA SVG logo.
- [x] Copy all six responsive JPG/WebP banner assets.
- [x] Copy favicon, touch-icon and Android icon assets.
- [x] Copy and validate the Gupea web manifest and its relative icon URLs.
- [x] Restore the favicon generator with the tracked GUPEA SVG as the default source when `logo.png` is absent.
  Verified artwork and transparency in all four ICO sizes and the three PNG
  outputs. Generated test files outside the theme.
- [x] Verify locally served theme assets and desktop/mobile banner source selection.
- [ ] Review deployed asset URLs and visual banner cropping on GUPEA.

### Docker and release tooling

- [x] Adapt the production Dockerfile from the 10.1 version using a supported Node runtime.
- [x] Adapt dependency installation to the target package-manager/lockfile workflow.
- [x] Verify whether the stock production container heap limit is sufficient.
- [x] Preserve JSON-form container commands where still applicable.
- [x] Adapt the multistage development image and dependency cache.
- [x] Activate the development cache entrypoint in the image and test dependency linking and invalidation.
- [ ] Verify institutional Compose entrypoint overrides and mounted volumes.
- [x] Update build/push scripts and replace `dspace-8_x` image naming.
- [x] Assign a migration release identifier in `docker/build/.env`.
- [x] Correct the `gup_i18n`/`gub_i18n` Docker exclusion mismatch if that exclusion is intended.
- [x] Decide the disposition of `Dockerfile.dist.memoryfix`; do not use its malformed line unchanged.
- [x] Decide the disposition of `tmp.patch`; do not reapply already-ported changes.
- [x] Build and run both images. Verify development dependency startup and theme serving, and production SSR in the test environment.

### Final verification and acceptance

- [x] Run the target production build and relevant lint/type checks (see phase validation evidence).
- [x] Verify 10.1 SSR initial markup, both languages and theme stylesheet serving.
- [ ] Review initial-render flicker in the deployed environment.
- [x] Verify local mobile menu, focused keyboard activation, language switching and configured footer links.
- [ ] Review full keyboard navigation and accessibility on the deployed site.
- [ ] Complete the metadata, search, authentication, submission and deployment checks above.
- [x] Record which reassessed customizations were retained, replaced or omitted and why.
- [x] Review the final diff to ensure upstream fixes were retained and only intended customizations were added.
- [x] Record test evidence and outstanding limitations before production rollout.
