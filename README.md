# Learning Management System (LMS)

A fullstack Learning Management System built with React + Vite (frontend), Node.js + Express (backend), PostgreSQL (database), and React Native + Expo (mobile).

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React + Vite + TailwindCSS |
| Backend   | Node.js + Express        |
| Database  | PostgreSQL                |
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

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

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

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lms_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## License
MIT
