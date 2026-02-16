# Use Cases to Data Model Map

This document maps functional use cases to the relational tables and keys described in DATA_MODEL.md. It is intended to help maintainers know exactly which tables to join per flow.

## Related Docs
- [DATA_MODEL.md](DATA_MODEL.md)
- [db/schema.sql](db/schema.sql)

## Conventions
- PK = primary key, FK = foreign key.
- When a flow uses optional tables, it is called out explicitly.

## Use Cases

### 1) Buy one or more tickets in a single transaction
**Tables:** `orders`, `order_items`, `tickets`, `buyers`

**Key relationships:**
- `orders.buyer_id` -> `buyers.id`
- `order_items.order_id` -> `orders.id`
- `order_items.ticket_id` -> `tickets.id`

**Notes:**
- One order can include many order_items (batch purchase).
- Each order_item points to exactly one ticket.

### 2) Manage ticket inventory and availability
**Tables:** `tickets`, `ticket_types`

**Key relationships:**
- `tickets.ticket_type_id` -> `ticket_types.id`

**Notes:**
- `tickets.status` controls availability (available, reserved, sold).
- `tickets.reserved_until` supports temporary holds.

### 3) Assign attendee details to each ticket
**Tables:** `attendees`, `tickets`, `order_items`

**Key relationships:**
- `attendees.ticket_id` -> `tickets.id` (1:1)
- `order_items.ticket_id` -> `tickets.id`

**Notes:**
- This supports cases where the buyer is different from attendees.

### 4) Apply a promo code to an order
**Tables:** `promo_codes`, `orders`, `promo_redemptions` (optional)

**Key relationships:**
- `orders.promo_code_id` -> `promo_codes.id`
- `promo_redemptions.promo_code_id` -> `promo_codes.id`
- `promo_redemptions.order_id` -> `orders.id`

**Notes:**
- Use `promo_redemptions` if you need an audit trail per order/buyer.

### 5) Record organizer-required registration data
**Tables:** `attendees`

**Key relationships:**
- `attendees.ticket_id` -> `tickets.id`

**Notes:**
- All required organizer fields live in `attendees`.
- Optional demographics and consents are stored as nullable fields.

### 6) Support ticket categories or sale phases
**Tables:** `ticket_types`, `tickets`

**Key relationships:**
- `tickets.ticket_type_id` -> `ticket_types.id`

**Notes:**
- Each ticket belongs to one type (early bird, general, etc.).

### 7) Track payments and reconciliation
**Tables:** `payments`, `orders`

**Key relationships:**
- `payments.order_id` -> `orders.id`

**Notes:**
- Useful for provider status tracking and audit.

### 8) Send ticket confirmation email with QR
**Tables:** `tickets`, `attendees`, `orders`, `buyers`

**Key relationships:**
- `attendees.ticket_id` -> `tickets.id`
- `order_items.ticket_id` -> `tickets.id`
- `orders.buyer_id` -> `buyers.id`

**Notes:**
- QR can embed `tickets.id` or a derived `ticket_code`.
- Optional: add an `email_logs` table for delivery tracking.

### 9) Export attendees to CSV/PDF
**Tables:** `attendees`, `tickets`, `orders`, `buyers` (optional)

**Key relationships:**
- `attendees.ticket_id` -> `tickets.id`
- `order_items.ticket_id` -> `tickets.id`
- `orders.buyer_id` -> `buyers.id`

**Notes:**
- Export is a read-only flow over existing tables.

## Optional Extensions

### `email_logs`
**Purpose:** Trace outbound ticket emails.

**Columns (suggested):**
- `id` (PK)
- `ticket_id` (FK -> tickets.id)
- `recipient_email`
- `provider`
- `status`
- `sent_at`
- `created_at`

### `ticket_codes`
**Purpose:** Stable, non-sequential ticket identifiers for QR encoding.

**Columns (suggested):**
- `id` (PK)
- `ticket_id` (FK -> tickets.id, unique)
- `code` (unique)
- `created_at`
