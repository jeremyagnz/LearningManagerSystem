# backend/src/controllers

Route handler functions for every API resource.

Each file in this directory maps to one resource (e.g. `authController.js`,
`subjectController.js`) and exports the individual request-handler functions
that are wired up in `../routes/`.

Controllers are responsible for:
- Parsing and validating the incoming request (`req`)
- Calling the relevant model / service / database query
- Sending the HTTP response (`res`) with the appropriate status code and body

Business logic that is reused across controllers should be extracted into a
separate service module rather than duplicated here.
