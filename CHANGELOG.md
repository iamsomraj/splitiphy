# Changelog

## Unreleased (v0.2.0)

### 🚀 Enhancements

- Edit existing expenses: amounts, payers and splits are rebuilt and balances re-simplified
- Export a group's expenses and splits as a CSV file
- Search and filter group expenses by text, category and date range
- Shareable group invite links, which the owner can revoke

### 🔒 Security

- Require group membership in every group action (add member, delete expense, settle up, simplify, user search)
- Scope expense and balance lookups to their group
- Re-fetch member profiles from Clerk instead of trusting client data
- Guard CSV exports against spreadsheet formula injection
- Resolve 71 of 72 `pnpm audit` advisories by upgrading dependencies

### 🏡 Chore

- Upgrade to Next.js 16, React 19, Clerk Core 3, Tailwind CSS 4, Drizzle ORM 0.45, zod 4, ESLint 9 flat config and TypeScript 6
- Rename `middleware.ts` to `proxy.ts` and move auth checks into the protected layout
- Require Node.js 22+ (24 recommended)

## v0.1.1

### 🚀 Enhancements

- Add nextjs-toploader package for improved page loading ([b7a4250](https://github.com/iamsomraj/splitiphy/commit/b7a4250))

### 💅 Refactors

- Delete group and associated records ([7be46fc](https://github.com/iamsomraj/splitiphy/commit/7be46fc))
- Delete group and associated records ([09f8dd1](https://github.com/iamsomraj/splitiphy/commit/09f8dd1))
- Update redirect path in editGroup action ([0fb8067](https://github.com/iamsomraj/splitiphy/commit/0fb8067))
- Add length check in delete group action ([c0b293b](https://github.com/iamsomraj/splitiphy/commit/c0b293b))
- Add length check in delete group action ([c94f280](https://github.com/iamsomraj/splitiphy/commit/c94f280))
- Update database configuration to use URL instead of individual credentials ([f086cfd](https://github.com/iamsomraj/splitiphy/commit/f086cfd))
- Add membership check when group edit action is submitted ([e27e142](https://github.com/iamsomraj/splitiphy/commit/e27e142))
- Add view group btn in group item ([7144dab](https://github.com/iamsomraj/splitiphy/commit/7144dab))
- Update header text in site configuration ([6b6f4ce](https://github.com/iamsomraj/splitiphy/commit/6b6f4ce))
- Update header text in site configuration ([627f2da](https://github.com/iamsomraj/splitiphy/commit/627f2da))
- Update node version ([9719bfe](https://github.com/iamsomraj/splitiphy/commit/9719bfe))
- Update default title in metadata to use siteConfig.header ([1cd9c6e](https://github.com/iamsomraj/splitiphy/commit/1cd9c6e))

### 🏡 Chore

- Update page-header styling for better spacing ([13815a8](https://github.com/iamsomraj/splitiphy/commit/13815a8))

### ❤️ Contributors

- Somraj Mukherjee ([@iamsomraj](http://github.com/iamsomraj))
