# backend/src/config

Application-wide configuration and external service clients.

| File             | Purpose                                              |
|------------------|------------------------------------------------------|
| `database.js`    | Creates and exports a `pg.Pool` instance configured from `DATABASE_URL` |
| `constants.js`   | Shared application constants (e.g. `ROLES`, `ALL_ROLES`) used across middleware, controllers, and schema |

Additional config files (e.g. for cloud storage, email, caching) should be
placed here so that all third-party client setup is isolated in one location
and easy to swap out or mock during testing.
