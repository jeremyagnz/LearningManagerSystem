# Learning Management System (LMS)

A fullstack Learning Management System built with React + Vite (frontend), Node.js + Express (backend), Supabase / PostgreSQL (database), and React Native + Expo (mobile).

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React + Vite + TailwindCSS |
| Backend   | Node.js + Express        |
| Database  | Supabase (PostgreSQL)    |
| Auth      | JWT (JSON Web Tokens)    |
| Mobile    | React Native + Expo      |

## Project Structure

```
/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite web app
└── mobile/           # React Native + Expo app
```

## Features

### Students
- Register / Login with JWT authentication
- View & enroll/unenroll from subjects
- View and submit assignments (with file upload)
- View grades and teacher feedback
- Manage profile

### Teachers
- Create, edit, and delete subjects
- Upload assignments with deadlines
- Upload course materials (PDFs, videos, links)
- View enrolled students per subject
- View and grade student submissions with feedback

## Database Schema

- **users** — id, name, email, password, role (student/teacher)
- **subjects** — id, title, description, teacher_id
- **enrollments** — id, student_id, subject_id
- **assignments** — id, subject_id, title, description, due_date
- **submissions** — id, assignment_id, student_id, file_url, grade, feedback
- **materials** — id, subject_id, title, content_url, material_type

## Getting Started

### Option 0 — Docker Compose (fastest, zero-config)

If you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed, you can spin up the entire stack (database + backend + frontend) with a single command:

```bash
docker-compose up --build
```

Then open `http://localhost:5173` and log in with the demo accounts below.

> **What it does:** starts a PostgreSQL container, runs the backend (auto-creates tables and demo users on first start), and serves the compiled frontend — all pre-configured.

> **To stop:** press `Ctrl+C`, then run `docker-compose down` (add `-v` to also remove the database volume).

---

### Manual Setup — Prerequisites
- Node.js 18+
- A **Supabase** project (free tier is sufficient) **or** a local PostgreSQL 14+ instance

---

### 1 — Set up the database

#### Option A — Supabase (recommended)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase dashboard.
3. Run the migration file to create all tables:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. *(Optional)* Run the seed file to create the two demo accounts:
   ```
   supabase/seed.sql
   ```
5. Go to **Settings → Database** to find your connection string, and **Settings → API** to find your project URL and keys.

#### Option B — Local PostgreSQL

**Option B.1 — automated script (recommended)**

From the repository root:

```bash
bash scripts/create-db.sh
```

Pass optional arguments to use a different PostgreSQL user, host, or port:

```bash
bash scripts/create-db.sh <pg_user> <pg_host> <pg_port>
# e.g. bash scripts/create-db.sh myuser 127.0.0.1 5433
```

Or use the npm shortcut from the `backend/` directory:

```bash
cd backend
npm run db:create
```

**Option B.2 — manual psql**

Open a terminal and run:

```bash
psql -U postgres
```

Then inside the `psql` prompt:

```sql
CREATE DATABASE lms_db;
\q
```

> If your PostgreSQL user or port differ, adjust the `DATABASE_URL` in `backend/.env` accordingly.

---

### 2 — Backend Setup

```bash
cd backend
cp .env.example .env
```

**For Supabase**, open `backend/.env` and set:

```env
PORT=5000

# Supabase connection string (Transaction Pooler — from Settings → Database → Connection string)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase API settings (from Settings → API)
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**For a local PostgreSQL instance**, set:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Then install dependencies and start the server:

```bash
npm install
npm run dev
```

On first start the server automatically:
1. Creates all database tables (if they do not already exist).
2. Inserts two **demo accounts** (see below).

> **Note for Supabase:** if you already ran the SQL migration and seed files in step 1, the server will skip creating tables/users that already exist.

The backend runs on `http://localhost:5000`.

---

### 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

The Vite dev-server proxies all `/api/*` requests to `http://localhost:5000`, so **no extra frontend configuration is needed for local development**.

---

### 4 — Log in

Open `http://localhost:5173` in your browser. You will be redirected to the login page.

#### Demo accounts (created automatically on first backend start)

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Teacher | demo.teacher@lms.com     | demo1234   |
| Student | demo.student@lms.com     | demo1234   |

Use the **"Acceso Rápido (Demo)"** buttons on the login page or enter the credentials manually.

---

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get current user profile
- `PUT /api/auth/profile` — Update profile name

### Subjects
- `GET /api/subjects` — Get my subjects (enrolled for students, created for teachers)
- `GET /api/subjects/all` — Get all subjects
- `POST /api/subjects` — Create subject (teacher only)
- `PUT /api/subjects/:id` — Update subject (teacher only)
- `DELETE /api/subjects/:id` — Delete subject (teacher only)
- `POST /api/subjects/:id/enroll` — Enroll in subject (student only)
- `DELETE /api/subjects/:id/enroll` — Unenroll (student only)
- `GET /api/subjects/:id/students` — List enrolled students (teacher only)

### Assignments
- `GET /api/assignments/my` — Get all assignments for enrolled subjects (student)
- `POST /api/assignments` — Create assignment (teacher)
- `GET /api/assignments/subject/:subjectId` — Get assignments for a subject
- `PUT /api/assignments/:id` — Update assignment (teacher)
- `DELETE /api/assignments/:id` — Delete assignment (teacher)

### Submissions
- `GET /api/submissions/my` — Get my submissions (student)
- `POST /api/submissions` — Submit assignment with optional file (student)
- `GET /api/submissions/assignment/:assignmentId` — Get submissions for assignment (teacher)
- `PUT /api/submissions/:id/grade` — Grade submission (teacher)

### Materials
- `GET /api/materials/subject/:subjectId` — Get materials for a subject
- `POST /api/materials` — Upload material (teacher)
- `DELETE /api/materials/:id` — Delete material (teacher)

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000

# Supabase (recommended)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# — or — Local PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/lms_db

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
# For local development, leave this unset — Vite's dev-server proxy forwards /api/* to localhost:5000.
# For production (e.g. Netlify), set this to your deployed backend's full API URL:
# VITE_API_URL=https://your-lms-backend.onrender.com/api
VITE_API_URL=
```

## Deployment

### Frontend → Netlify

1. Connect your repository to Netlify.
2. Configure the build settings (these match `netlify.toml`):
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add the following environment variable in **Site configuration → Environment variables**:

   | Key | Value |
   |-----|-------|
   | `BACKEND_URL` | `https://your-lms-backend.onrender.com` |

   This is used by the `netlify.toml` proxy redirect that forwards all `/api/*`
   requests from the Netlify site to your deployed backend. Without it, every
   API call (including login) returns **404**.

   > **Note:** do not include a trailing slash or the `/api` path — the
   > redirect rule appends those automatically.

4. Trigger a new deploy so Netlify picks up the variable.

### Backend → Render / Railway / Heroku

Set the following environment variables on your backend host:

```env
PORT=5000
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
JWT_SECRET=your_production_secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-netlify-site.netlify.app
```

`FRONTEND_URL` is used by the backend's CORS configuration — make sure it matches your Netlify domain exactly.

## Troubleshooting Login

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `404 Not Found` on `/api/auth/login` (Netlify) | `BACKEND_URL` not set in Netlify environment variables | Add `BACKEND_URL=https://your-lms-backend.onrender.com` in **Site configuration → Environment variables** and trigger a new deploy |
| `Server error` on login | Backend can't connect to the database | Check `DATABASE_URL` in `backend/.env`; if using Supabase make sure you copied the correct connection string and that SSL is enabled |
| `Invalid credentials` | Wrong email/password | Use the demo credentials from the table above, or register a new account at `/register` |
| Login page never loads | Frontend can't reach the backend | Make sure the backend is running on port 5000 **before** opening the frontend |
| `No token provided` / instant redirect to `/login` | JWT secret missing | Set a non-empty `JWT_SECRET` in `backend/.env` |
| CORS error in browser console | `FRONTEND_URL` mismatch | Set `FRONTEND_URL=http://localhost:5173` in `backend/.env` |
| Demo accounts not created | Seed ran before tables existed | Stop the server, verify the database is accessible, and restart with `npm run dev` (or run `supabase/seed.sql` manually in the Supabase SQL Editor) |

## License
MIT
