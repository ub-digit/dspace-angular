# GUPEA theme infrastructure (DSpace 10.1)

`config/config.yml` selects `gupea`, with `dspace` as its component parent.
The DSpace eager and listable registrations remain enabled because GUPEA
inherits the wrapper, navbar and homepage from that theme. Missing parent overrides
fall back to core components through the standard theme loader.

`angular.json` builds `gupea-theme.css` without injecting it. DSpace loads that
bundle when the theme is selected, including during SSR. Theme inheritance is
for components, not styles: `styles/theme.scss` therefore includes the full
10.1 Sass pipeline and one import of the core global styles. No DSpace CSS
bundle is needed for this configuration.

Add future eager overrides to `eager-theme-components.ts` and components using
`@listableObjectComponent` to `lazy-listable-components.ts`. The eager list
currently registers the GUPEA header; the listable list is empty. Do not restore
the 8.x theme NgModules. Keep the 10.1 accessibility and responsive behavior
when migrating the remaining footer and homepage components.

Assets are copied automatically by the existing webpack theme asset rule to
`assets/gupea/`. The GUPEA header now uses the institutional SVG logo. The
responsive banners remain available for the upcoming homepage migration.
Favicons and the web manifest are active through theme `headTags`. The favicon
generator was omitted because its source `logo.png` is absent on the 8.x branch.

The header extends the 10.1 DSpace themed header and references its stylesheet.
Its template differs from the target header only in the logo URL. No separate
GUPEA wrapper/navbar is needed: all three 8.x files in each of those directories
were identical to upstream 8.x. Continue to inherit their current 10.1 versions,
including mobile animations, dynamic navigation and the authenticated user menu.

Nunito continues to load from Google Fonts as in 8.x. Bootstrap 5 contrast
selection replaces the old YIQ threshold; table stripes and badges use Bootstrap
5 names. The old 95% default modal width is intentionally deferred until dialogs
can be reviewed. The 250px community/collection logo maximum is now theme scoped.

Validate using a supported Node release (see `package.json`) and the committed
npm lockfile, rather than the historical 8.x Yarn instructions:

```sh
npm ci
npm run lint
npm run build:prod
```

See [the migration report](../../../docs/dspace-10-migration.md) for progress,
validation evidence and remaining behavior/visual acceptance checks.
