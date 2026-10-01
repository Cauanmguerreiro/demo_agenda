# CodeBrand Showcase Implementation Plan

> Execution: native implementation in this session, followed by whole-branch review.

**Goal:** Expand seven scheduling presets into 70 interactive business demonstrations.

**Architecture:** Catalog and URL routing around the preserved scheduling application, with 13 specialized experience families and isolated local state.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind and Lucide.

**Spec:** `docs/superpowers/specs/2026-10-01-codebrand-showcase-design.md`

## Global Constraints

- Exactly 70 accessible profiles, including all seven existing scheduling demos.
- Portuguese UI, CodeBrand identity, fictional companies and locally simulated transactions.
- Shared links via `?demo=id`; no backend, API keys or real checkout.
- Storage failures cannot prevent using a demo.

## Review Focus

- Unknown route and browser back should recover to the catalog.
- Cart quantities and inventory withdrawals cannot exceed available units.
- Switching profiles cannot leak edits between companies.
- Mobile controls and tables must stay within the viewport.
- Invalid storage must fall back safely to fresh data.

### Task 1: Catalog and business rules

**Files:** `src/showcase/catalog.ts`, `src/showcase/model.ts`, `tests/showcase.test.ts`, `package.json`.
**Interfaces:** `DemoProfile`, `DemoItem`, `filterProfiles`, `changeCart`, `cartTotal`, `changeStock`, `loadDemoState`, `saveDemoState`.

- [x] Write and run failing tests for search, bounded cart, stock and storage isolation.
- [x] Create 63 contextual business profiles and expose the original seven.
- [x] Implement validated state rules and safe storage.
- [x] Run `npm test` and commit.

### Task 2: Gallery and interactive experiences

**Files:** `src/App.tsx`, `src/AgendaApp.tsx`, `src/showcase/Gallery.tsx`, `src/showcase/Experience.tsx`, `src/showcase/experiences/*`, `src/showcase/showcase.css`, `index.html`.
**Interfaces:** gallery consumes the catalog; experiences consume `DemoProfile` and state rules; routing supplies `onNavigate(id)`.

- [x] Add browser checks for deep links, gallery filters and representative business actions.
- [x] Implement responsive gallery, routing, preserved agendas and 13 distinct experience families.
- [x] Add local persistence, reset, favorites, presentation controls and simulated results.
- [x] Run browser checks, `npm test`, `npm run lint`, `npm run build` and commit.

### Task 3: Delivery

**Files:** `README.md`, CI workflow, browser smoke tests.

- [x] Document workflows, 70 profile inventory and honest demo limitations.
- [x] Review the complete diff and resolve important issues.
- [x] Run clean installation and final checks.
- [ ] Push the feature branch and open a PR.

## Verification record

- Six business-rule tests pass, including corrupt storage, cart normalization and invalid stock movements.
- Chromium verifies all 70 profiles on desktop and at 375px, plus every new workflow, favorites, filters, reset, browser back and presentation synchronization.
- A separate visual inspection found clipped gallery copy on mobile; a geometry regression test now protects the corrected grid sizing.
- Clean `npm ci`, TypeScript, production build and formatting pass.
- Independent code review found no critical issues; cart restoration, movement validation and lazy-content mobile checks were corrected. Browser readiness now verifies its own server startup.
