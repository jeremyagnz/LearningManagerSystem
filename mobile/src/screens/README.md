# mobile/src/screens

Full-screen React Native components rendered by the navigator.

## Subdirectories

| Folder      | Contents                                                       |
|-------------|----------------------------------------------------------------|
| `auth/`     | `LoginScreen.js`, `RegisterScreen.js` — unauthenticated entry flow |
| `student/`  | Home, subjects, assignments, grades screens for student users  |
| `teacher/`  | Home, subjects, submissions screens for teacher users          |

## Guidelines

- Each screen is registered as a `<Stack.Screen>` (or equivalent) inside
  `src/navigation/AppNavigator.js`.
- Screens own data-fetching logic (via hooks or direct service calls) and
  compose reusable components from `src/components/`.
- Navigation is accessed through React Navigation's `useNavigation` hook or
  the `navigation` prop passed by the navigator.
