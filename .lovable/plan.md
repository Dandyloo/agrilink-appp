## Goal

Make AgriLink fully usable on phones. Fix the sidebar so it's accessible on mobile, and tighten responsive layouts across landing, farmer, and buyer screens.

## 1. Mobile sidebar (the broken feature)

Currently `AppSidebar` is `hidden md:flex`, so on phones there is no navigation at all from any dashboard.

Update `src/components/layout.tsx`:
- Keep the existing fixed sidebar for `md+`.
- On mobile, render a slide-in drawer with the same nav items, using the existing shadcn `Sheet` component (already in the project).
- Add a hamburger button to `TopBar` (visible only `<md`) that opens the sheet.
- Active route + sign-out behavior identical to desktop. Closes on link tap.
- Keep the Navy color, AgriLink brand mark, and badge inside the drawer.

No new dependencies, no router or auth changes.

## 2. Landing page responsiveness (`src/routes/index.tsx`)

- Stack hero copy above imagery on `<md`; reduce heading from `text-6xl` to fluid `text-4xl sm:text-5xl lg:text-6xl`.
- Convert "Preview as Farmer/Buyer" + Sign in/up button rows to `flex-col sm:flex-row` with full-width buttons on mobile.
- Footer columns: `grid-cols-2 md:grid-cols-4`.
- Ensure horizontal overflow is eliminated (audit any fixed widths).

## 3. Farmer dashboard + sub-pages

For each of: `farmer.dashboard`, `farmer.listings`, `farmer.finance`, `farmer.wallet`, `farmer.prices`, `farmer.orders`, `farmer.notifications`, `farmer.settings`:
- Stat/metric cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- Tabs: allow horizontal scroll (`overflow-x-auto`) instead of wrapping/clipping.
- Tables (orders, listings, prices): wrap in `overflow-x-auto` with `min-w-[640px]` inner table, OR collapse to card list `<sm`.
- Modals (new listing, withdraw): `max-h-[90vh] overflow-y-auto`, full-width on mobile with `mx-4`.
- Wallet Navy balance card: reduce padding and font sizes on mobile; keep Gold metrics intact.
- Prices sparklines: ensure mini-chart row scrolls horizontally on small screens.

## 4. Buyer dashboard + sub-pages

For each of: `buyer.dashboard`, `buyer.marketplace`, `buyer.orders`, `buyer.analytics`, `buyer.notifications`, `buyer.settings`:
- Marketplace filter row: already `sm:grid-cols-4`; verify checkbox alignment and stack to 1-col on phones.
- Listing card grid already responsive — confirm image heights and button tap target ≥44px.
- Order modal: already has `max-h-[90vh]`; widen to `max-w-md` but `w-full` with safe padding.
- Analytics: donut + bar charts wrap in `flex-col lg:flex-row`; legends below charts on mobile.
- Orders table → card list on `<sm`.

## 5. Shared polish

- Reduce `TopBar` padding from `px-6` to `px-4 sm:px-6`; truncate greeting with `truncate`.
- `main` padding from `p-6` to `p-4 sm:p-6`.
- Ticker keeps its marquee but font scaled down on mobile.
- USSD simulator (`ussd.tsx`): center on screen, max-w-sm, already phone-shaped — verify safe-area padding.
- Add `min-w-0` to flex children that contain truncating text per responsive guideline.

## Out of scope

- No auth, routing, or data-model changes.
- No new pages, no design-token changes.
- Gold color stays reserved for financial metrics.

## Verification

After changes: open preview at 375×812 (mobile) and click through Landing → Preview as Farmer → each sidebar item via hamburger → Preview as Buyer → marketplace → place order. Take a screenshot at mobile and desktop to confirm no overflow and sidebar drawer works.
