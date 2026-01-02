# Obsidian Plugin - Overdue

This plugin marks checkbox items as `[[Overdue]]` if you do not check them off by their due date.

[![BuyMeACoffee](https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-yellow.svg)](https://www.buymeacoffee.com/parente)

## Usage

For instance, say you have items like the following:

```markdown
# In file 2020-01-01.md

- [x] Something I completed
- [ ] Something I didn't

# In another-file.md

- [x] Something else I completed [[2020-01-02]]
- [ ] Something else I forgot about [[2020-02-15]]
```

When the plugin runs any time after January 1st, 2020 _local time_, it will make the following changes:

```markdown
# In file 2020-01-01.md

- [x] Something I completed
- [ ] Something I didn't [[Overdue]]

# In another-file.md

- [x] Something else I completed [[2020-01-02]]
- [ ] Something else I forgot about [[2020-02-15]] [[Overdue]]
```

The plugin runs automatically just after midnight to update your pages. You can also trigger the
plugin using `Overdue: Mark overdue items` in the Obsidian command palette.

Opening a backlinks panel for the `Overdue` page shows all of your overdue items in one location.

The plugin only adds `[[Overdue]]` references, never removes them. When you complete an overdue
item, check it off and delete the `[[Overdue]]` text to stop it from appearing in the overdue
backlinks.

## Development

```bash
cd /path/to/vault/.obsidian/plugins
git clone git@github.com:parente/overdue.git
npm i
npm run lint
npm run dev
```

See https://github.com/obsidianmd/obsidian-sample-plugin for additional details.
