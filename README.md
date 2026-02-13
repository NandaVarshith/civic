

## 3. Backend Setup (`backend/`)

1. Move to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file inside `backend/`:

```env
PORT=5000
DB_URL=mongodb://127.0.0.1:27017/np_db
JWT_SECRET=replace_with_your_secret
```

4. Start backend server:

```bash
npm run dev
```

If successful, you should see:
- `connected to db`
- `Server is running on port 5000`

Backend base URL: `http://localhost:5000`

## 4. Frontend Setup (`frontend/`)

Open a new terminal and run:

1. Move to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Ensure `axios` is installed (used by auth/logout pages):

```bash
npm install axios
```

```

5. Start frontend:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

## 5. Running Full Project

Run both servers at the same time:
- Terminal 1: `backend` -> `npm run dev`
- Terminal 2: `frontend` -> `npm run dev`

Then open `http://localhost:5173`.

## 6. Available App Routes (Frontend)

- `/register`
- `/login`
- `/dashboard`
- `/analytics`
- `/mapview`
- `/myissues`
- `/notifications`
- `/profile`
- `/raiseissue`
- `/logout`

## 7. API Endpoints (Current Backend)

- `POST /api/register`
- `POST /api/login`

Example register payload:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "role": "user"
}
```

Example login payload:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

## 8. Static Interface Files

`interfaces/` contains static HTML/CSS mock pages for admin/user screens. These are not the React runtime app.


