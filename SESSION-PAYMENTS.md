# Session payments — frontend demo

## Try the flow

1. Open the existing parent booking flow with an approved specialist and a child profile.
2. Select a date/time and choose **Continue to Demo Payment**.
3. The dialog starts at **Awaiting payment**. Try **Simulate failure**, retry, or return without confirming a booking. The dialog expires after ten minutes; this does not reserve availability on a server.
4. Accept the demo notice and submit. Only successful demo checkout creates the confirmed booking. Open **My Bookings** to see the payment record.
5. In the specialist workspace, complete the consultation using the existing consultation workflow.
6. Open **Earnings**. The session settlement now shows as pending, with gross price, commission and net amount. Legacy bookings without payment records are excluded from earned totals.
7. Open Admin → Billing Management. The new session panel supports changing the commission for future bookings and recording a demo transfer after completion.
8. Cancel a paid, untransferred booking. Its payment becomes refund pending. Admin can record a full demo refund. Cancelled sessions earn no commission. Already transferred cancellations are flagged for manual review.

## Data and integration

- `rafiqCommissionRate`: default 10%, editable from Admin Billing Management. Each payment snapshots its own rate.
- `rafiqBookings[].sessionPayment`: demo provider, payment reference/date, gross amount, commission rate/amount, specialist net, payment status and settlement status.
- Payment statuses: `paid`, `refund_pending`, `refunded`. Awaiting and failed checkout are dialog states; they do not create confirmed bookings.
- Settlement statuses: `held` before completion, `pending` after explicit completion, `transferred` after an admin demo action, and `blocked`/`void` for refunds.
- `session-finance.js` provides checkout and reconciliation; `session-finance.css` provides shared UI styles. Subscription checkout remains separate.

This is localStorage-based demonstration data, not financial accounting or access control. There are no real Orange Money requests, bank transfers, refunds, wallet credentials, backend slot reservations, or gateway fees. No wallet number, PIN, or card data is collected for session checkout. Browser data can be edited or cleared.

For live integration, the backend must own pricing, commission snapshots, booking/payment records, slot availability, provider verification, idempotency, refunds, authentication, authorization and settlement actions. A browser success state must never serve as proof of payment.
