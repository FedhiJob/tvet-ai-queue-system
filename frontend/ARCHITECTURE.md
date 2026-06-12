# TVET AI Queue System — Frontend Architecture

This repo uses **Next.js App Router**. The “layers” are organized as follows:

## Conventions / boundaries

### `frontend/app/`
Route segments and page shells.
- `app/page.tsx` (root route)
- `app/<segment>/page.tsx` (route pages)
- `app/layout.tsx` / `app/<segment>/layout.tsx` (route layouts)

**Rule:** put route-level composition here (what renders and how it wires components/services).

### `frontend/app/components/`
Reusable presentational UI.
- Buttons, cards, tables, feedback components
- Smaller UI building blocks used by pages

**Rule:** components should be mostly UI + props, not direct business logic.

### `frontend/app/services/`
API client layer (fetch/axios wrappers).
- E.g. `request.service.ts`, `queue.service.ts`

**Rule:** services own HTTP calls + DTO typing; they should not render UI.

### `frontend/app/types/`
Shared TypeScript types / DTOs.

**Rule:** types should be imported by pages/components/services.

### `frontend/app/hooks/` (reserved)
Client-side hooks (optional in future phases).

### `frontend/app/lib/` (reserved)
Shared client-side utilities (optional in future phases).

### `frontend/app/providers/` (reserved)
Context providers (auth, theme, react-query) (optional in future phases).

## Current mapping in this repo
- ✅ `app/components/*` → reusable UI
- ✅ `app/services/*` → API clients
- ✅ `app/types/*` → DTO/type definitions
- ✅ `app/<route>/page.tsx` → routes

