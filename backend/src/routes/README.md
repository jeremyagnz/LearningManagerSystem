# backend/src/routes

Express router definitions — maps HTTP verbs + URL paths to controller functions.

Each file in this directory corresponds to one API resource group
(e.g. `auth.js`, `subjects.js`) and is mounted on a base path inside
`src/app.js` (e.g. `/api/auth`, `/api/subjects`).

Routes are kept intentionally thin: they attach middleware (auth guards, rate
limiters, validators) and delegate all business logic to the matching
controller in `../controllers/`.
