# TODO - TVET AI Queue System

## Frontend & Backend: Student Request Submission (Phase 1)

- [ ] Add backend API route(s):
  - [ ] POST `/requests` to create request (body: service_type, description, is_urgent, student_name?)
  - [ ] Return: request_id, priority, queue_position, predicted_wait_minutes
  - [ ] Initialize DB + seed services/staff on startup

- [ ] Add frontend page route:
  - [ ] Create Next.js page: `frontend/app/requests/new/page.tsx`
  - [ ] Implement professional layout (top navbar + left sidebar) + request form
  - [ ] Call backend `POST /requests` and show success state (ID/priority/queue position/wait)

- [ ] Add supporting frontend structure:
  - [ ] `frontend/app/components/Sidebar.tsx`, `Navbar.tsx`, `StatsCard.tsx`, etc. (as required for this first page)
  - [ ] `frontend/app/services/request.service.ts` (API layer)

## After Phase 1 (later)
- [ ] Requests tracking page `/requests`
- [ ] Queue monitor `/admin/queue`
- [ ] Appointments `/appointments`
- [ ] Admin dashboard `/admin`

