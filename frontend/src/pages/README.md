# frontend/src/pages

Top-level route components — one file (or subdirectory) per application page.

## Subdirectories

| Folder      | Contents                                                |
|-------------|---------------------------------------------------------|
| `auth/`     | `Login.jsx`, `Register.jsx` — public authentication pages |
| `student/`  | Dashboard, subjects, assignments, grades, profile pages for students |
| `teacher/`  | Dashboard, subjects, assignments, submissions pages for teachers |

## Guidelines

- A page component is responsible for fetching its own data (via a hook or
  direct service call) and composing smaller `components/` to render the UI.
- Pages are registered as `<Route>` elements in `src/App.jsx`.
- Shared sub-sections of a page that are too large to stay inline should be
  extracted into `components/` rather than nested pages.
