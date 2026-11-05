# RHshop - Multi-Role Real-Time Order Lifecycle System

This project implements a multi-role, real-time e-commerce order lifecycle management system supporting **Customer**, **Warehouse / Fulfillment Staff**, and **Admin / Seller** personas.

---
test
## 1. Multi-Role Authentication & Session Isolation

### Client Storage Key Isolation
To allow testing across multiple browser tabs and windows without session overwrites:
- **Customer actor**: stored under `store_customer_token` in `localStorage`.
- **Staff / Warehouse / Admin actors**: stored under `store_staff_token` in `localStorage`.
- The Axios interceptor (`frontend/src/api/client.ts`) and backend middleware (`backend/src/middleware/auth.ts`) dynamically check actor headers (`x-customer-token` vs `x-staff-token`) based on the targeted route, preventing session conflicts.

### Route Guards & Role Landing Pages
- **Storefront Home** (`/`): Rich e-commerce landing page with hero carousel, curated categories, value propositions, and demo spotlight.
- **Catalog Shop** (`/shop`): Full catalog with category filters (Shirts, Pants, Outerwear, Accessories), price slider, keyword search, and sorting.
- **Product Detail** (`/product/:id`): Product showcase with image gallery, color/size swatches, quantity selector, specs tabs, and express checkout.
- **Shopping Cart** (`/cart`): Interactive cart with item list, size/color badges, quantity adjustment, promo code calculator, and free shipping tracker.
- **Checkout** (`/checkout`): Streamlined checkout with 1-click demo autofill, Delivery vs In-Store Pickup toggles, and address forms.
- **Order Confirmation** (`/order-confirmation/:id`): Order success celebration with direct "Live Order Tracker" button and warehouse fulfillment shortcuts.
- **Customer Tracker** (`/track/:id`): Real-time order progress stepper (3-second background polling).
- **Fulfillment Queue** (`/fulfillment`): Warehouse dispatch dashboard (`ProtectedRoute` allowedRoles: `WAREHOUSE`, `ADMIN`) with Web Audio arrival alerts.
- **Admin Portal** (`/admin`): Real-time metrics, live catalog stock management, and throughput telemetry (`ProtectedRoute` allowedRoles: `ADMIN`).
- **Session Manager** (`/login`): Quick 1-click persona switching (Alice Customer, Bob Warehouse, Charlie Admin).

---

## 2. Real-Time Synchronization (TanStack Query / React Query)

#### Active Polling Dashboards
- **Fulfillment Queue** (`frontend/src/hooks/useFulfillmentQueue.ts`):
  - Polls `/api/fulfillment/queue` every **3000 ms** (`refetchInterval: 3000`, `refetchIntervalInBackground: true`).
- **Customer Order Status Tracker** (`frontend/src/hooks/useOrderStatusTracker.ts`):
  - Polls `/api/orders/:id/status` every **3000 ms**.
  - Automatically ceases polling when terminal statuses (`COMPLETED`, `DELIVERED`, `CANCELLED`) are reached.
- **Admin Live Metrics & Inventory** (`frontend/src/hooks/useAdminMetrics.ts`):
  - Polls `/api/admin/metrics` every **4000 ms**.
  - Provides real-time catalog inventory telemetry (stock, reserved units, available units, low-stock warnings) and incoming order tickets.

### Instant Cache Invalidation
Whenever any mutation occurs (e.g. customer places order, warehouse accepts ticket, carrier dispatches item, order cancelled):
- `queryClient.invalidateQueries({ queryKey: ['fulfillmentQueue'] })`
- `queryClient.invalidateQueries({ queryKey: ['orderStatus', orderId] })`
- `queryClient.invalidateQueries({ queryKey: ['adminMetrics'] })`
This guarantees instant UI updates for the actor performing the action while background polling updates other tabs within 3-5 seconds.

---

## 3. Audio & Visual Arrival Alert

### Web Audio API Synthesizer
- Built in `frontend/src/utils/audio.ts` using the browser's native `AudioContext`.
- Plays a dual-tone arrival chime (D5 587.33 Hz gliding to A5 880 Hz with harmonic overtone) when a new order ID appears in the polled queue that was not present in the prior poll.
- Includes browser autoplay unlocking listener on initial user interaction.
- Operates concurrently on both the **Warehouse Fulfillment Queue** and the **Admin Live Order Stream**.
- Requires zero external audio files or mp3 downloads.
- Includes a mute toggle button in the navigation header.

### Visual Arrival Highlight
- Newly arrived orders receive the `.arrival-highlight` CSS class, displaying a pulsing gold border ring for 6 seconds before gracefully fading to standard styling.

---

## 4. End-to-End Order State Machine & Inventory Flow

Explicit order lifecycle transitions implemented in `backend/src/stateMachine/orderStateMachine.ts`:

```
                 ┌────────────────────────────────────────────────────────┐
                 │                                                        │
                 ▼                                                        │
[PLACED] ──────► [PROCESSING] ──────► [READY_FOR_PICKUP] ──────► [COMPLETED]
   │                 │                        ▲
   │                 └──────► [SHIPPED] ──────┴────────────────► [DELIVERED]
   │                             │
   ▼                             │
[CANCELLED] ◄────────────────────┘
```

- **Delivery Path**: `PLACED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`
- **Pickup Path**: `PLACED` -> `PROCESSING` -> `READY_FOR_PICKUP` -> `COMPLETED`
- **Inventory Integration**: Placing an order automatically reserves stock; order cancellation releases reserved stock; completion/delivery deducts physical catalog stock.
- **Security & Ownership**: Customer cancellation is restricted to orders owned by the authenticated customer and only while in `PLACED` status. Unauthenticated requests are rejected with `401 Unauthorized`.
- **Fulfillment Operations**: Dedicated staff-scoped endpoints (`/api/fulfillment/orders/:id/accept`, `/api/fulfillment/orders/:id/dispatch`, `/api/fulfillment/orders/:id/complete`, `/api/fulfillment/orders/:id/deliver`, `/api/fulfillment/orders/:id/status`) ensure staff tokens are always preserved.

---

## 5. Local Multi-Device Testing & Docker Setup

### Reverse Proxy & Same-Origin Configuration
- **Vite Dev Server** (`frontend/vite.config.ts`):
  - Configured with `host: '0.0.0.0'` to allow connections from local Wi-Fi / LAN IP.
  - Reverse proxy routes `/api` directly to backend (`http://localhost:5001`), ensuring requests share the same origin and completely eliminating CORS issues on mobile phones.
- **Nginx in Docker** (`frontend/nginx.conf`):
  - Production container forwards `/api/` traffic to `http://backend:5001/api/`.

### Docker Compose
Run all services together:
```bash
docker compose up --build
```
- PostgreSQL 16 on port `5434`
- Express 5 Backend on port `5001`
- Frontend with Nginx on port `3000`

---

## 6. Verification & Test Suite

Run the automated test suite covering state machine validation, session isolation, audio change detection, pickup lifecycle, customer cancellation, inventory tracking, and storefront cart/checkout calculation contracts:

```bash
# Run all 38 backend and frontend tests
node --test backend/src/__tests__/*.test.mjs frontend/src/__tests__/*.test.mjs
```

