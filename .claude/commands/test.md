Run the project tests and type checks:

1. Run `cd rules && npx tsc --noEmit` to check TypeScript strict mode
2. Run `cd rules && yarn build` to check Vite build
3. Run `cd rules && npx vitest run` to run all tests

Report any errors found. If there are TypeScript errors, fix them. If tests fail, analyze the failure and suggest fixes.
