## What I'll change

### 1. Recent orders — stacked cards on mobile (both dashboards + buyer/farmer order lists)
The current `<table>` squeezes 5–6 columns into a 375px screen, which is what you're seeing. Fix:
- On `< sm`: render each order as a card (crop image + crop name, buyer/farmer line, qty · date, total + status pill on the right, action button full-width below).
- On `≥ sm`: keep the existing table.
- Apply the same pattern to `farmer.dashboard.tsx`, `buyer.dashboard.tsx`, `farmer.orders.tsx`, and `buyer.orders.tsx` so the experience is consistent.

### 2. Wire up every "decorative" feature

**Marketplace (`buyer.marketplace.tsx`)**
- The "All crop types" dropdown currently has no `value`/`onChange` and does nothing. Make it a controlled filter that narrows results by crop name (case-insensitive).
- Combine with the existing search box so both work together.

**Finance Hub (`farmer.finance.tsx`)**
- Invoice Financing form collects buyer name + delivery date but throws them away — extend `credit_applications` schema with optional `buyer_name`, `delivery_date`, `notes`, and persist them so "Past applications" actually shows what you applied for.
- Show buyer/date/notes in the Past applications list.
- Add a "Withdraw application" button on `submitted` rows that sets status to `cancelled`.

**Wallet (`farmer.wallet.tsx`)**
- Withdrawal currently inserts a transaction with no validation feedback and no confirmation. Improvements:
  - Validate phone (10-digit Ghana format) and amount ≤ balance with inline errors.
  - Show a success toast on the wallet page after withdrawal.
  - Create a notification row ("Withdrawal of GHS X to MTN MoMo completed").

**Settings (`farmer.settings.tsx` + `buyer.settings.tsx`)**
- Notification toggles are local-state only. Add a `notification_prefs` jsonb column on `profiles` (defaults: orders/price/finance on, marketing off) and persist toggles immediately on click. Read from profile on mount.

**Notifications (`farmer.notifications.tsx` + `buyer.notifications.tsx`)**
- Add a Supabase realtime subscription so new notifications (and unread badge in top bar) appear without refresh.
- Add a "Clear all read" action that deletes read rows.
- Fix unread badge live-update by invalidating on insert.

**Farmer Prices (`farmer.prices.tsx`)**
- Stays on static `COMMODITY_PRICES` (per your earlier scope), but add a search input + region filter chips so the page actually does something. No backend change.

**Landing / sign-in / verify**
- Already wired — no changes.

### 3. Schema changes (one migration)
- `ALTER TABLE credit_applications` → add `buyer_name text`, `delivery_date date`, `notes text`. Extend status check to include `cancelled`, `approved`, `rejected`.
- `ALTER TABLE profiles` → add `notification_prefs jsonb NOT NULL DEFAULT '{"orders":true,"prices":true,"finance":true,"marketing":false}'::jsonb`.
- Enable realtime publication for `notifications`.

### 4. Out of scope (call-outs)
- Commodity prices stay static reference data, as agreed previously.
- No new payment/MoMo integration — withdrawal still records the intent in `wallet_transactions` like it does today.
- Admin/approval workflow for credit applications is left as a manual DB action; UI just shows the status that's set.

## Files touched
- migration (new): schema changes above
- `src/routes/farmer.dashboard.tsx`, `src/routes/buyer.dashboard.tsx`
- `src/routes/farmer.orders.tsx`, `src/routes/buyer.orders.tsx`
- `src/routes/buyer.marketplace.tsx`
- `src/routes/farmer.finance.tsx`
- `src/routes/farmer.wallet.tsx`
- `src/routes/farmer.settings.tsx`, `src/routes/buyer.settings.tsx`
- `src/routes/farmer.notifications.tsx`, `src/routes/buyer.notifications.tsx`
- `src/routes/farmer.prices.tsx`
- `src/routes/__root.tsx` (realtime subscription for unread badge)

After implementation I'll walk both journeys at mobile width (375px) to confirm nothing regresses.