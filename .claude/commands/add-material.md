Add new game material to the project. Follow the checklist exactly:

1. Add a new value to `MaterialType` enum in `rules/src/material/MaterialType.ts`
2. Create `app/src/material/*Description.ts` extending `CardDescription`, `TokenDescription`, `BoardDescription`, or `RoundTokenDescription`
3. Register in `app/src/material/Material.ts`
4. Add any new `LocationType` values in `rules/src/material/LocationType.ts`
5. Create `app/src/locators/*Locator.ts` for each new LocationType
6. Register locators in `app/src/locators/Locators.ts`
7. Optionally create `app/src/material/*Help.tsx` for the help dialog
8. Add translations (EN + FR) in `app/src/i18n/translations-export.json`

After creating the files, run `yarn build` in `rules/` and `npx tsc --noEmit` in `rules/` to check for errors.

The user will describe what material to add.
