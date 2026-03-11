# mobile/src/context

React Context providers that share global state across the mobile app.

| File               | Purpose                                                      |
|--------------------|--------------------------------------------------------------|
| `AuthContext.js`   | Stores the JWT token and decoded user object, exposes `login` / `logout` helpers, and persists the session to AsyncStorage so the user stays logged in across app restarts |

## Guidelines

- One context per concern — add new files (e.g. `ThemeContext.js`) rather than
  growing a single monolithic context.
- Expose a `use<Name>` hook (e.g. `useAuth`) so screens never call
  `useContext` directly.
