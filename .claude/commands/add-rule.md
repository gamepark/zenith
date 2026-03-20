Add a new game rule/phase to the project. Follow the checklist exactly:

1. Add a new value to `RuleId` enum in `rules/src/rules/RuleId.ts`
2. Create `rules/src/rules/*Rule.ts` extending `PlayerTurnRule` or `SimultaneousRule`
3. Register the rule in `rules/src/ZenithRules.ts` → `rules` getter
4. Create `app/src/headers/*Header.tsx` with the header component
5. Register in `app/src/headers/Headers.tsx`
6. Add translations (EN + FR) in `app/src/i18n/translations-export.json` for the header keys

After creating the files, run `yarn build` in `rules/` and `npx tsc --noEmit` in `rules/` to check for errors.

The user will describe what the rule should do.
