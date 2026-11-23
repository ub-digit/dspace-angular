# GUPEA translation updates

Run these commands from the repository root:

```bash
source gub_i18n/setup-python.sh
gub_i18n/run_update_translations.sh sv
```

The setup uses the pinned Python version if asdf is installed. Add the Python
plugin with `asdf plugin add python` if needed. Without asdf, setup uses the
system Python 3.

The script reads the retained translation snapshot and writes a
`src/assets/i18n/<language>.json5.updated` candidate. It updates existing
string entries whose value still matches their original-language comment.
Existing translations, new keys, and entries without comments require manual
review. The stock English catalog has no such comments. The script also applies
the local branding replacements and skip words, and preserves the target's
interpolation parameters. Review the candidate diff before applying it.

To use different source and target catalogs:

```bash
python gub_i18n/update_translations.py source.json5 target.json5
```
