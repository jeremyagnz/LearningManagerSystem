# frontend/src/context

React Context providers that share global application state.

| File              | Purpose                                                     |
|-------------------|-------------------------------------------------------------|
| `AuthContext.jsx`  | Provides the authenticated user object, login/logout helpers, and a loading flag to the entire component tree |

## Guidelines

- Keep contexts focused — one context per concern (auth, theme, notifications…).
- Expose a custom `use<Name>` hook (e.g. `useAuth`) alongside each context so
  consumers never import `useContext` + the context object directly.
- Heavy data-fetching state is better managed with a dedicated hook or a
  library (React Query, SWR) than added to a context.
