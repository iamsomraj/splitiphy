<div align="center">

# splitiphy

**Split bills, not friendships.**

A free, open-source Splitwise alternative for trips, flats and friends.<br>
Track shared expenses, simplify who owes whom, and settle up in one tap.

[![Release](https://img.shields.io/github/v/release/iamsomraj/splitiphy?color=0d9467)](https://github.com/iamsomraj/splitiphy/releases)
[![License: GPL v3](https://img.shields.io/github/license/iamsomraj/splitiphy?color=0d9467)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/iamsomraj/splitiphy?style=flat&color=0d9467)](https://github.com/iamsomraj/splitiphy/stargazers)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-0d9467)](./CONTRIBUTING.md)

[**Try it live →**](https://splitiphy.vercel.app/) · [Report a bug](https://github.com/iamsomraj/splitiphy/issues/new?template=bug_report.yml) · [Request a feature](https://github.com/iamsomraj/splitiphy/issues/new?template=feature_request.yml)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/screenshots/landing-dark.png">
  <img alt="splitiphy landing page" src="./public/screenshots/landing-light.png">
</picture>

</div>

> [!TIP]
> If splitiphy saves you an awkward "who paid for what" conversation, please **[give it a ⭐ on GitHub](https://github.com/iamsomraj/splitiphy/stargazers)**. It helps other people find it.

## Why splitiphy?

- **Free and open source.** No ads, no premium tier, no limits on groups or expenses.
- **Built for real splits.** Several people can pay for one bill, and shares can be equal or custom.
- **Fewest payments to settle.** "Simplify" turns a web of IOUs into the smallest set of transfers.
- **Works great on your phone.** Mobile-first layout, light and dark mode, 20 currencies.
- **Yours to run.** Deploy your own copy on Vercel in a few minutes.

## Screenshots

| On your phone | Link preview |
| --- | --- |
| <img alt="splitiphy on a phone" src="./public/screenshots/landing-mobile.png" width="260"> | <img alt="splitiphy social preview card" src="./public/og.png" width="520"> |

## Features

- 👥 **Groups**: create groups, add members by search, or share an invite link
- 💸 **Expenses**: add, edit and delete expenses with custom splits and multiple payers
- 🧮 **Simplify debts**: collapse everyone's balances into the fewest possible payments
- 🤝 **Settle up**: record settlements between members
- 🔎 **Search & filter**: find expenses by text, category and date range
- 📄 **CSV export**: download a group's expenses and splits for spreadsheets
- 📊 **Dashboard**: yearly spending chart across all your groups
- 🌗 **Themes**: light and dark mode, with a currency preference per user

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions) + React 19
- [Clerk](https://clerk.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) + [Neon](https://neon.tech/) serverless Postgres
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/)

## Run Locally

### Prerequisites

- Node.js 22 or newer (24 recommended, see `.nvmrc`)
- [pnpm](https://pnpm.io/)
- A Clerk application and a Postgres database (for example, Neon)

### Steps

1. Clone the repository

   ```bash
   git clone https://github.com/iamsomraj/splitiphy.git
   cd splitiphy
   ```

2. Set up environment variables by copying `.env.example` to `.env` and filling in:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
   - `CLERK_SECRET_KEY` - Clerk secret key
   - `DATABASE_URL` - Postgres connection string

3. Install dependencies

   ```bash
   pnpm install
   ```

4. Create the database tables

   ```bash
   pnpm db:migrate
   ```

5. Run the application

   ```bash
   pnpm dev
   ```

## Scripts

| Script             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm dev`         | Start the development server                     |
| `pnpm build`       | Create a production build                        |
| `pnpm start`       | Serve the production build                       |
| `pnpm lint`        | Lint the project with ESLint                     |
| `pnpm fix`         | Lint and auto-fix problems                       |
| `pnpm format`      | Format sources with Prettier                     |
| `pnpm typecheck`   | Type-check with TypeScript                       |
| `pnpm db:generate` | Generate a SQL migration from `src/db/schema.ts` |
| `pnpm db:migrate`  | Apply pending migrations to `DATABASE_URL`       |
| `pnpm db:push`     | Push the schema directly (prototyping only)      |
| `pnpm db:studio`   | Open Drizzle Studio                              |

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fiamsomraj%2Fsplitiphy&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,DATABASE_URL&envDescription=Clerk%20keys%20and%20a%20Postgres%20connection%20string&envLink=https%3A%2F%2Fgithub.com%2Fiamsomraj%2Fsplitiphy%23run-locally&project-name=splitiphy&repository-name=splitiphy)

The app deploys to Vercel with zero configuration. Set the three environment variables above in the Vercel project (Production and Preview), and run `pnpm db:migrate` against the production database whenever a new migration is added under `drizzle/`.

## Contributing

Contributions are very welcome, from typo fixes to new features. Read [CONTRIBUTING.md](./CONTRIBUTING.md) to get set up, and look for issues labelled [`good first issue`](https://github.com/iamsomraj/splitiphy/labels/good%20first%20issue) if you're new here.

## Author

Built by **Somraj Mukherjee**: [LinkedIn](https://www.linkedin.com/in/iamsomraj/) · [Portfolio](https://iamsomraj.github.io/) · [GitHub](https://github.com/iamsomraj)

## Show your support

If you like splitiphy, a ⭐ on [GitHub](https://github.com/iamsomraj/splitiphy) means a lot and helps others discover it.

[![Star History Chart](https://api.star-history.com/svg?repos=iamsomraj/splitiphy&type=Date)](https://star-history.com/#iamsomraj/splitiphy&Date)

## License

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)
