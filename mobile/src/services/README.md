# mobile/src/services

API client modules that handle all HTTP communication with the LMS backend.

| File      | Purpose                                                              |
|-----------|----------------------------------------------------------------------|
| `api.js`  | Axios instance pre-configured with the base URL (`API_URL` env var) and a request interceptor that attaches the JWT `Authorization` header from AsyncStorage |

## Guidelines

- No UI or navigation logic here — service functions return plain Promises.
- Keep one file per resource group (authService.js, subjectService.js…) as
  the API surface grows.
- Error handling (showing alerts, logging out on 401) belongs in the calling
  screen or hook, not here.
