# backend/src/middleware

Custom Express middleware used across routes.

| File              | Purpose                                                        |
|-------------------|----------------------------------------------------------------|
| `auth.js`         | JWT verification; attaches `req.user` and enforces role-based access control |
| `rateLimiter.js`  | express-rate-limit configurations (default and auth-specific)  |
| `upload.js`       | Multer configuration for handling multipart/form-data file uploads |

Middleware functions follow the `(req, res, next) => {}` signature and are
composed in route definitions or applied globally in `src/app.js`.
