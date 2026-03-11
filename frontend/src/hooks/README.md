# frontend/src/hooks

Custom React hooks that encapsulate reusable stateful logic.

Hooks abstract away complex or repetitive patterns (data fetching, form
handling, debouncing, etc.) so that page and component code stays declarative
and easy to read.

Naming convention: every file starts with `use` (e.g. `useAuth.js`,
`useSubjects.js`) to comply with the React rules-of-hooks linting rule.

A hook should:
- Do one thing well
- Return only the data/actions its consumers need
- Not contain JSX
