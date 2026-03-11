# mobile/src/components

Reusable React Native UI components shared across multiple screens.

Place any component here that is used in more than one screen, or that is
complex enough to justify isolation for testing or reuse:

- Custom buttons, input fields, cards, badges
- Loading spinners and skeleton placeholders
- Modal dialogs and bottom sheets
- Any other presentational building block

## Guidelines

- Name files after the component (PascalCase), e.g. `PrimaryButton.js`.
- Keep components presentational — receive data via props, emit events via
  callback props.
- Screen-specific components that are unlikely to be reused can stay in the
  screen file; move them here once a second consumer appears.
