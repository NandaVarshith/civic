# UrbanPulse – Civic Issue Management Platform

UrbanPulse is a MERN-style application that lets citizens report civic issues, track their status, and let workers/admins manage resolution. It includes authentication, role‑based dashboards, issue submission with media, notifications, analytics, and (WIP) assignment tooling.

---

## Features
- **Role-based flows**: `user`, `worker`, and `admin` roles enforced on both API (JWT+cookies) and React Router guards.
- **Authentication**: Register, login (httpOnly JWT cookie), logout, profile editing, and password change.
- **Issue lifecycle**: Citizens raise issues with category, priority, location (lat/long), remarks, and images (base64). Issues are listed per-role; statistics endpoint drives dashboard cards.
- **Notifications**: Persisted notifications per user with unread/read filtering and issue deep-links.
- **Dashboards & analytics**: Summary cards, issue tables, map/heatmap placeholders, and worker performance table stubs.
- **Assignment workspace (admin)**: UI scaffold to search/filter and assign issues (currently uses mock data; ready for API wiring).
- **Tech stack**: React 19 + Vite 7 + React Router 7, Axios; Express 5, Mongoose 9, JWT, bcrypt, cookie-parser, CORS; MongoDB.

---

## Repository Structure
- `backend/` – Express API, MongoDB models, auth/authorization middleware, issue + notification routes.
- `frontend/` – Vite + React client, route guards, pages, and shared components.
- `interfaces/` – Static design mockups (not part of the runtime app).

---

## Prerequisites
- Node.js 20+ and npm
- MongoDB running locally or a connection string (Atlas/local)
- Two terminals (one for API, one for UI)

---

## Backend Setup (`backend/`)
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
DB_URL=mongodb://localhost:27017/civic
JWT_SECRET=replace_with_strong_secret
VITE_API_URL=http://localhost:5000
ADMIN_ID=<ObjectId of an admin user for notifications>
```

Run the server (with nodemon):
```bash
npm run dev
```
Expected logs: `connected to db` then `Server is running on port 5000`.

---

## Frontend Setup (`frontend/`)
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/
```

Start Vite dev server (defaults to port 5173):
```bash
npm run dev
```

---

## Running the Full Stack
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`
- Open `http://localhost:5173` in the browser.

CORS is already configured in the API to allow `http://localhost:5173` with credentials.

---

## Key API Endpoints (current)
- `POST /api/register` – create user (role defaults to `user`)
- `POST /api/login` – issues httpOnly JWT cookie
- `GET  /api/logout` – clears auth cookie
- `GET  /api/me` – returns decoded user payload
- `GET  /api/user` – profile details (sans password)
- `PUT  /api/user/password` – change password
- `PUT  /api/user/updateprofile` – update profile fields
- `DELETE /api/user` – delete profile
- `POST /api/issues` – create issue (images accepted as base64 strings)
- `GET  /api/issues` – list issues scoped by role (reported, assigned, or all)
- `GET  /api/issues/statistics` – totals and status/category distributions
- `POST /api/notifications` – create notification
- `GET  /api/notifications` – list notifications for current user

> Note: Issue assignment/update routes are not yet implemented server-side; the admin UI uses mock data until wired.

---

## Data Models (abridged)
- **User**: `username`, `email`, `password (hashed)`, `role` (`user|worker|admin`), `phone`, `profileImage`, `isActive`.
- **Issue**: `title`, `description`, `status` (`Pending|Assigned|In Progress|Resolved|Closed`), `category`, `priority`, `location{address,lat,long}`, `images[]`, `reportedBy`, `assignedTo`, `remarks[]`, timestamps.
- **Notification**: `recipient`, `sender`, `issue`, `type`, `message`, `isRead`, timestamps.

---

## Frontend Routes (by role)
- Public: `/login`, `/register`
- Auto-redirect home `/` -> role dashboard
- User: `/user/dashboard`, `/user/analytics`, `/user/mapview`, `/user/myissues`, `/user/notifications`, `/user/profile`, `/user/raiseissue`, `/user/logout`
- Admin: same as user but `assignissue` instead of `raiseissue`
- Worker: dashboard, analytics, mapview, myissues, notifications, profile, logout

Route access is enforced both client-side (route guards) and server-side (JWT + `authorize` middleware).

---

## Development Notes
- Always send `withCredentials: true` in Axios so cookies are included.
- Images are stored as base64 strings today; consider moving to object storage + URLs for production.
- `ADMIN_ID` must reference an existing admin user to receive auto-created notifications on new issues.
- Statistics cards rely on `/api/issues/statistics`; ensure roles are correct when testing.
- Current analytics/assignment/map visualizations contain placeholder data—wire them to real endpoints as you extend the API.

---

## Scripts
- Backend: `npm run dev`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

---

## Next Improvements (suggested)
- Add issue assignment + status update endpoints and hook the admin UI to them.
- Persist notification read state and add “mark as read” API.
- Replace placeholder charts/maps with real data visualizations (e.g., Chart.js/Mapbox).
- Add automated tests (API + React) and CI workflow.

