# Amortiza+ — Mortgage Simulator

A home-loan simulator for the Brazilian market, built with **React Native (Expo)**, **Expo Router**, **React Native Paper** and **TypeScript**.

## Features

- **SAC** (decreasing installments) and **Price** (fixed installments) amortization systems
- Live input masks, per-field validation and hints (down-payment %, equivalent monthly rate, number of installments)
- Result screen with first/last installment, total interest, total paid, a **SAC vs Price comparison** and a yearly **outstanding-balance chart**
- Full month-by-month schedule (virtualized list)
- Save, reopen, edit, share and delete simulations (stored locally with AsyncStorage)
- Light and dark themes following the system setting

> Estimates only: insurance (MIP/DFI), administrative fees and TR are not included.

## Project structure

```
app/                  # Routes (Expo Router) — only screens live here
  _layout.tsx         # Providers (Paper + navigation theme) and Stack
  index.tsx           # Home
  loan/form.tsx       # Simulation form
  loan/summary.tsx    # Result + schedule
  loan/saved.tsx      # Saved simulations
components/           # Reusable UI (header, dialog, chart, schedule table…)
constants/            # Texts (pt-BR) and theme
hooks/                # Color-scheme hooks
lib/                  # Pure logic: amortization, formatting, validation, storage
  __tests__/          # Jest unit tests
styles/               # Layout-only StyleSheets (colors come from the theme)
```

## Running

```sh
npm install
npm start          # then open in Expo Go, an Android emulator or the iOS simulator
```

Other scripts:

| Script              | What it does                     |
| ------------------- | -------------------------------- |
| `npm test`          | Run unit tests once              |
| `npm run test:watch`| Run tests in watch mode          |
| `npm run typecheck` | TypeScript check                 |
| `npm run lint`      | ESLint                           |
| `npm run build`     | Production build with EAS        |

## Calculation

The interest rate entered is the **effective annual rate** (as quoted by Brazilian banks), converted to the equivalent monthly rate:

$$i = (1 + i_{a})^{1/12} - 1$$

With principal $P$ (property value − down payment) and $n$ monthly installments:

**Price** — fixed installment:

$$A = P \cdot \frac{i(1+i)^n}{(1+i)^n - 1}$$

**SAC** — fixed amortization $P/n$; installment $k$ is

$$A_k = \frac{P}{n} + i \cdot \left(P - (k-1)\frac{P}{n}\right)$$

The last installment settles any floating-point residue so the balance always ends at exactly zero.

## Roadmap

- Insurance (MIP/DFI), admin fee and TR in the installment
- Extra (early) amortization simulation
- Export to PDF
