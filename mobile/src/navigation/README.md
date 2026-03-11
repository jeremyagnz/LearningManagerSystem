# mobile/src/navigation

React Navigation stack, tab, and drawer navigator definitions.

| File                | Purpose                                                     |
|---------------------|-------------------------------------------------------------|
| `AppNavigator.js`   | Root navigator — switches between `AuthStack` (login/register) and the authenticated `MainStack` based on the user's auth state from `AuthContext` |

## Guidelines

- Keep navigator files thin: define screen stacks/tabs and pass route params;
  avoid business logic here.
- Typed route params (if using TypeScript) should be declared in a
  `navigation/types.ts` file.
- Deep-link configuration belongs in `app.json` (Expo) and is wired up in
  the root navigator.
