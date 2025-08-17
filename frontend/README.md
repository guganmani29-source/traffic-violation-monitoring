# Frontend (React + Vite) - Traffic Violation Monitoring

Simple dashboard for Violations, Challans, and Alerts.

## Quick Start
```bash
cd frontend
npm install
cp .env.example .env   # Windows: copy .env.example .env
# edit .env to point to your backend: VITE_API_BASE_URL
npm run dev
```
Open http://localhost:3000

## Notes
- Login page expects POST /api/auth/login to return { token }.
- All API requests include Authorization: Bearer <token> if stored in localStorage.
