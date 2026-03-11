# frontend/src/services

API client modules that encapsulate all HTTP communication with the backend.

`api.js` — Axios (or fetch) instance pre-configured with the base URL and a
request interceptor that attaches the JWT `Authorization` header from
localStorage. Each exported function maps to one API endpoint, e.g.:

```js
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
```

## Guidelines

- No UI logic here — services return plain Promises/data.
- Error handling (showing toasts, redirecting on 401) belongs in the calling
  component or a custom hook, not in the service layer.
- Group related endpoints in the same file (authService.js, subjectService.js)
  when the service layer grows large.
