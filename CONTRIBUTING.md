# Contributing to splitiphy

Thanks for helping make splitiphy better! Bug fixes, features, docs and design tweaks are all welcome.

## Getting started

1. Fork the repo and clone your fork.
2. Follow [Run Locally](./README.md#run-locally) to set up Clerk, Postgres and your `.env`.
3. Create a branch: `git checkout -b fix/short-description`.

Looking for something to work on? Try an issue labelled [`good first issue`](https://github.com/iamsomraj/splitiphy/labels/good%20first%20issue) or [`help wanted`](https://github.com/iamsomraj/splitiphy/labels/help%20wanted).

## Making changes

- Run `pnpm typecheck` and `pnpm lint` before pushing. A pre-commit hook also runs the linter.
- Format with `pnpm format`.
- If you change `src/db/schema.ts`, generate a migration with `pnpm db:generate` and commit it.
- Check UI changes on a phone-sized screen. Most people use splitiphy on their phone.

## Commit messages

Releases and the changelog are generated with [changelogen](https://github.com/unjs/changelogen), so please use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(groups): add recurring expenses
fix(mobile): keep the add button above the home indicator
docs: explain how to run migrations
```

## Pull requests

Open a PR against `main`, describe what changed, and add screenshots for UI changes. Small, focused PRs are easiest to review.

By contributing, you agree that your contributions are licensed under the [GPL-3.0 license](./LICENSE).
