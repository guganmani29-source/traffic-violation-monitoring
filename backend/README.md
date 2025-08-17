# Backend (Traffic Violation Monitoring)

Express + MongoDB API implementing CRUD for **Violations**, **Challans**, and **Alerts** with JWT-protected endpoints.

## Endpoints
- `GET/POST /api/violations` — list/create violations
- `GET/PUT/DELETE /api/violations/:id` — read/update/delete a violation
- `GET/POST /api/challans` — list/create challans (one per violation)
- `GET /api/challans/:id` — get challan
- `PATCH /api/challans/:id/paid` — mark challan paid (updates violation status)
- `GET/POST /api/alerts` — list/create alerts
- `PATCH /api/alerts/:id/read` — mark alert as read
- `DELETE /api/alerts/:id` — delete alert

> All routes are protected with `Authorization: Bearer <JWT>`

## Quick Start
```bash
cd backend
npm install
cp .env.example .env   # on Windows: copy .env.example .env
# set MONGO_URI and JWT_SECRET in .env
npm run dev
```

## Notes
- Challan creation enforces one-challan-per-violation and future `dueDate`.
- Marking challan paid also sets violation status to `paid`.
