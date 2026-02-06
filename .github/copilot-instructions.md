# Copilot Instructions for Planner Codebase

## Project Overview
- **Planner** is a Next.js/React TypeScript app for visualizing and managing academic schedules.
- The UI is component-driven, with a focus on flexible schedule/event rendering and pastel-themed visual clarity.
- Key business logic and types are in `lib/`, while UI logic is in `components/` (notably `components/schedule/`).

## Architecture & Patterns
- **Component Structure:**
  - `components/schedule/` contains all schedule-related UI (e.g., `event-block.tsx`, `schedule-table.tsx`).
  - `components/ui/` holds reusable UI primitives (e.g., `button.tsx`, `badge.tsx`).
  - `lib/schedule-store.ts` manages schedule state (likely with Zustand or similar pattern).
  - Types and enums are centralized in `lib/schedule-types.ts`.
- **Styling:**
  - Uses CSS modules and utility classes (e.g., Tailwind, see `globals.css`).
  - Pastel color palettes and gradients are used for event types (see style objects in `event-block.tsx`).
- **Event Rendering:**
  - `EventBlock` is the main event cell renderer, supporting multiple layouts (standard, diagonal, compact, makeup events).
  - Conditional rendering is used for badges, week cycles, and group/project tags.
  - Comments in JSX must use `{/* ... */}` syntax (not `{ ... }`).

## Developer Workflows
- **Build:** Uses Next.js (`next build`), package manager is pnpm (`pnpm install`, `pnpm dev`).
- **Type Checking:** TypeScript enforced via `tsconfig.json`.
- **Styling:** PostCSS and Tailwind (see `postcss.config.mjs`).
- **No explicit test setup** detected—add tests in a `__tests__` or `tests/` folder if needed.

## Conventions & Gotchas
- **Client/Server Components:** Use `'use client'` at the top of client components.
- **Props:** Prefer explicit prop interfaces for all components.
- **Event Types:** Use enums/constants from `lib/schedule-types.ts` for event logic.
- **Abbreviations:** Makeup event abbreviations are mapped in `event-block.tsx`.
- **Do not use curly braces for comments in JSX**—always use `{/* ... */}`.
- **State Management:** Centralize schedule state in `lib/schedule-store.ts`.
- **Imports:** Use `@/lib/...` and `@/components/...` aliases for imports.

## Key Files & Directories
- `components/schedule/event-block.tsx` — Main event rendering logic and style patterns.
- `lib/schedule-types.ts` — Event, group, and control type definitions.
- `lib/schedule-store.ts` — Schedule state management.
- `components/ui/` — UI primitives for consistent design.
- `app/` — Next.js app entry and layout.

## Example: Adding a New Event Type
1. Add the type to `lib/schedule-types.ts`.
2. Update style objects and logic in `event-block.tsx`.
3. Add any new badges or UI in `components/ui/` if needed.

---
For questions, review the above files for patterns before introducing new ones. Keep UI logic declarative and state minimal in components.
