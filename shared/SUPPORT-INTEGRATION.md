# Support integration

## Pages
- Parent: My account > Help Center.
- Specialist: Help Center in the shared sidebar.
- Admin: Support Requests in the admin sidebar.
- Public registration/login pages also link to Help Center.

## Current preview
`shared/support-config.js` has an empty `apiBase`. Tickets are stored under `rafiqSupportTickets` in localStorage. Preview ownership uses a random ID in sessionStorage, not an authenticated account. Only that browser session can follow its own requests; the admin preview reads all tickets on the same origin. Local storage is not a security boundary, and these guards are not production authorization. No email, notification or network delivery happens. Avoid real sensitive data in preview. Public WhatsApp remains available for registration assistance.

## Switch to backend
Implement the endpoints below and set `apiBase` to `/api` or your HTTPS API base. The browser uses cookie authentication (`credentials: include`). Supply your server-issued CSRF token through `csrfToken` for cookie-authenticated writes. Do not embed secrets or database credentials in frontend files. Configure CORS for your explicit frontend origin if using a separate API origin.

| Method | Path relative to apiBase | Input | Response |
|---|---|---|---|
| GET | /support/tickets | none | Ticket[] belonging to signed-in requester |
| POST | /support/tickets | {name,email,category,subject,message} | created Ticket |
| POST | /support/tickets/:id/messages | {body} | updated Ticket |
| GET | /admin/support/tickets | none | all Ticket[] (admin only) |
| POST | /admin/support/tickets/:id/messages | {body} | updated Ticket (admin only) |
| PATCH | /admin/support/tickets/:id | {status} | updated Ticket (admin only) |

Lists currently expect plain arrays containing messages, sorted newest updated first. Add pagination to both frontend and backend together if needed. Errors use non-2xx status; 401 for unauthenticated, 403 for forbidden, 400/422 for validation. Do not return private request content with an error.

Ticket: `{id, ownerId, requesterRole, name, email, subject, category, status, createdAt, updatedAt, messages:[{id,authorRole,body,createdAt}]}`. Times are ISO 8601. Categories: account, booking, profile, technical, other. Statuses: new, in_progress, resolved. Requester roles: parent, specialist, guest.

## Server requirements
Derive ownerId and requesterRole from the authenticated server session, never from query parameters, form values or browser storage. Derive message author and all timestamps on the server. Require admin role for every admin endpoint. Restrict every requester read/reply to its owner, enforce limits (name 100, email 254, subject 150, message 4000), validate categories/statuses, rate-limit submissions, and make replies/status changes transactional. A reply does not automatically reopen a resolved ticket in this UI.

For unauthenticated visitors, keep WhatsApp as the live assistance path or implement a separate guest flow with verified email and a secure expiring tracking token. Do not allow guest ticket lookup by email or predictable ID. In API mode the server can return 401 for guest submissions; no client identity or email is proof of ownership.

Use the SQL sketch as a starting point, adapt users foreign keys to your auth schema, and apply server authorization or row-level access policies before production. The schema alone does not provide access control. Database connection and deployment are not implemented here.