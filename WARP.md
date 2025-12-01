# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
This is a minimal React + Vite single-page application.
- Tooling: Vite 7 with `@vitejs/plugin-react` (Fast Refresh) configured in `vite.config.js`.
- Framework: React 19 with `react-dom` creating a single root in `index.html`.
- Entry point: `src/main.jsx` mounts `<App />` into the DOM element with id `root`.
- UI composition: `src/App.jsx` defines the top-level React component; the current implementation is the default Vite counter demo and is expected to be replaced or extended with the Minesweeper UI and logic.

## Commands and workflows
Examples below use `npm`, but any Node-compatible package manager can be used; scripts are defined in `package.json`.

### Setup
- `npm install` — install project dependencies.

### Development
- `npm run dev` — start the Vite development server with React Fast Refresh enabled.
- `npm run preview` — serve the production build locally (after `npm run build`).

### Build
- `npm run build` — create a production build in the `dist/` directory using Vite.

### Linting
- `npm run lint` — run ESLint over the project using the flat config in `eslint.config.js`.

### Testing
- There is currently **no test runner or `test` script** configured in `package.json`. Add a test framework (for example, Vitest or Jest) and corresponding scripts before relying on automated tests or single-test runs.

## Linting and code quality configuration
ESLint is configured via `eslint.config.js` using the flat config format:
- Starts from `@eslint/js` recommended rules.
- Adds `eslint-plugin-react-hooks` (recommended config) to enforce correct React Hooks usage.
- Adds `eslint-plugin-react-refresh` (Vite config) to keep components compatible with Fast Refresh.
- Targets all `*.js` and `*.jsx` files and assumes a browser environment via `globals.browser`.
- Uses a custom `no-unused-vars` rule that ignores variables whose names match the pattern `^[A-Z_]` (useful for constants and similar patterns).
- Ignores the `dist/` directory globally.

## Frontend architecture
High-level flow of the React application:
- **Vite bundling and dev server** are configured in `vite.config.js` with the React plugin; this handles JSX transform, HMR/Fast Refresh, and production bundling.
- **Application bootstrap** happens in `src/main.jsx`, which imports global styles from `src/index.css`, creates a React root with `createRoot`, and renders the application tree inside `<StrictMode>`.
- **Top-level UI** is controlled by `src/App.jsx`, which currently manages a simple `count` state and demonstrates asset imports (logos from `src/assets` and `/vite.svg`). As the Minesweeper implementation evolves, additional components and game logic should be organized under `src/` and composed into `App`.

## Repository-specific notes
- There are no project-specific AI assistant rules (Claude, Cursor, Copilot) or additional instructions beyond the standard Vite README at this time.
- When adding new tooling (tests, routing, state management, etc.), prefer to integrate with the existing Vite + React structure: new features should be mounted via `App.jsx` and configured through Vite/ESLint where appropriate.
