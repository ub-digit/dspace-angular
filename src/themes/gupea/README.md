# GUPEA theme infrastructure (DSpace 10.1)

`config/config.yml` selects `gupea`, with `dspace` as its component parent.
The DSpace eager and listable registrations remain enabled because GUPEA
inherits the wrapper and navbar from that theme. Missing parent overrides
fall back to core components through the standard theme loader.

`angular.json` builds `gupea-theme.css` without injecting it. DSpace loads that
bundle when the theme is selected, including during SSR. Theme inheritance is
for components, not styles: `styles/theme.scss` therefore includes the full
10.1 Sass pipeline and one import of the core global styles. No DSpace CSS
bundle is needed for this configuration.

The eager list registers the header, homepage and sign-in overrides. The listable
registry supplies the simple item page and item grid cards. The full metadata
and thumbnail components load through their themed wrappers. 
The homepage displays 20 communities per page without a numbered pager or
result count. Previous and Next appear when there are multiple pages.
The sign-in override hides password sign-in.

Assets are copied automatically by the existing webpack theme asset rule to
`assets/gupea/`. The header uses the institutional SVG logo, and the home-news
override uses the responsive banner images and translated archive introduction.
Favicons and the web manifest are active through theme `headTags`. To regenerate
the raster icons, install ImageMagick and `rsvg-convert`, then run
`src/themes/gupea/assets/images/favicons/create-favicons.sh` from the repository
root. The script uses `logo.png` if supplied alongside it and otherwise uses
the tracked `favicon.svg`. Pass a source image and an output directory to
generate previews outside the theme. Raster inputs need only ImageMagick.

The [Python translation workflow](../../../gub_i18n/README.md) generates
reviewable candidate catalogs from the retained GUPEA snapshots.

The header extends the 10.1 DSpace themed header and references its stylesheet.
Its template differs from the target header only in the logo URL. No separate
GUPEA wrapper/navbar is needed: all three 8.x files in each of those directories
were identical to upstream 8.x. Continue to inherit their current 10.1 versions,
including mobile animations, dynamic navigation and the authenticated user menu.

Nunito continues to load from Google Fonts as in 8.x. Bootstrap 5 contrast
selection replaces the old YIQ threshold; table stripes and badges use Bootstrap
5 names. Medium dialogs use the 8.x 95% maximum width. The 250px community/collection
logo maximum is theme scoped, and failed logos use the 8.x proportional SVG.

Validate using a supported Node release (see `package.json`) and the committed
npm lockfile, rather than the historical 8.x Yarn instructions:

```sh
npm ci
npm run lint
npm run build:prod
```

See [the migration report](../../../docs/dspace-10-migration.md) for progress,
validation evidence and remaining behavior/visual acceptance checks.
