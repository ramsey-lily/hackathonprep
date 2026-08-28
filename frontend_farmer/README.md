# Kasarani Farmer Frontend

Farmer-facing React app for the School–Farmer Food Supply Management System.
Talks only to the Flask backend — never to Supabase directly.

## 1. Where to put this

Drop this `farmer-frontend/` folder alongside your other project folders,
e.g.:

```
kasarani-foodlink/
├── backend/                 (Flask API)
├── frontend-school/         (existing school admin frontend)
├── frontend-farmer/         ← this folder goes here
└── docker-compose.yml
```

If you already have a `frontend-farmer` folder from the earlier prototype,
back it up, then copy these files in:

```
frontend-farmer/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Requests.jsx
│   │   ├── OfferForm.jsx
│   │   ├── Offers.jsx
│   │   ├── Orders.jsx
│   │   ├── PaymentStatus.jsx
│   │   ├── Profile.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── StatusBadge.jsx
│   │   └── StateViews.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── .env.example
```

## 2. Install and run

```bash
cd frontend-farmer
npm install
cp .env.example .env      # adjust REACT_APP_API_URL if your backend isn't on 127.0.0.1:5000
npm start
```

The app runs on `http://localhost:3000` by default. Run it alongside your
Flask backend (`http://127.0.0.1:5000`) and the school frontend.

### Docker Compose

Add a service like this to your existing `docker-compose.yml` (adjust the
port so it doesn't collide with the school frontend):

```yaml
frontend-farmer:
  build: ./frontend-farmer
  ports:
    - "3001:3000"
  environment:
    - REACT_APP_API_URL=http://backend:5000
  depends_on:
    - backend
```

## 3. Backend endpoints this app needs

### Already confirmed working

| Method | Endpoint | Used by |
|---|---|---|
| GET | `/requests?status=open` | Requests dashboard |
| POST | `/requests/:request_id/offers` | Offer submission form |

### Required but not yet confirmed — please implement or verify

These are called by the app and are needed for the features described in
the brief. If any of them don't exist yet, the corresponding screen will
show its normal error/empty state rather than fake data — nothing is
silently faked.

| Method | Endpoint | Used by | Notes |
|---|---|---|---|
| GET | `/requests/:id` | Request detail view | Optional — the app currently reuses data already fetched from the list, so this is a nice-to-have, not a blocker. |
| GET | `/farmers/:farmer_id/offers` | My Offers, Dashboard KPI | Expected fields: `id, request_id, food_item, quantity, unit, price, total, status, created_at`. |
| GET | `/farmers/:farmer_id/orders` | My Orders, Payments, Dashboard KPI | Expected fields: `id, request_id, school_name, food_item, quantity, unit, price, total_amount, status, payment_status, mpesa_receipt, created_at`. |
| GET | `/orders/:id` | Single order detail (not currently wired into a screen, but available in `client.js` for when you add one) | |

There is currently no farmer authentication endpoint. `CURRENT_FARMER_ID`
in `src/api/client.js` is hardcoded to `1` — see the `TODO(auth)` comment
there for the one place to change when login is added.

## 4. Order and payment status values expected

The UI recognizes these values and shows an appropriate badge/step; any
other string is still displayed, just without special styling:

- **Offer status:** `pending`, `accepted`, `rejected`
- **Order status:** `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled`
- **Payment status:** `unpaid`, `pending`, `paid`, `failed`

## 5. What's intentionally not built

- No Supabase client code anywhere in this app — by design.
- No M-Pesa/Safaricom API calls — the farmer app only displays whatever
  `payment_status` and `mpesa_receipt` the backend returns.
- No fabricated statistics — any dashboard KPI that depends on a
  not-yet-available endpoint shows `—` instead of a made-up number.
