# frontend/src/components

Reusable UI building blocks shared across multiple pages.

## Subdirectories

| Folder     | Contents                                                           |
|------------|--------------------------------------------------------------------|
| `common/`  | Generic utility components (e.g. `ProtectedRoute`, loading spinners, modals) |
| `layout/`  | Page-level structural components (`Navbar`, `Layout`, `Sidebar`)   |

## Guidelines

- Components should be **presentational first** — receive data via props and
  delegate side-effects to the parent or a custom hook.
- Each component lives in its own file named after the component (PascalCase).
- Barrel `index.js` files may be added to simplify import paths when a folder
  grows large.
