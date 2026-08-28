/**
 * Central API client for the Farmer frontend.
 *
 * Every network call the app makes goes through this file. The React
 * frontend never talks to Supabase directly — everything is proxied
 * through the Flask backend.
 *
 * Endpoint status is marked next to each function:
 *   [CONFIRMED]  - already used successfully by the existing frontend
 *   [EXPECTED]   - required by this app, but not confirmed against a
 *                  running backend. If the backend does not implement
 *                  it yet, calls will fail and the UI will show the
 *                  normal error state (see components) rather than
 *                  fabricated data.
 */

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

/**
 * TODO(auth): There is no login flow yet. Every request that needs a
 * farmer id currently uses this hardcoded value. Replace this with the
 * authenticated farmer's id once auth exists — every call below reads
 * from here, so it is the single place that needs to change.
 */
export const CURRENT_FARMER_ID = 1;

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (networkErr) {
    // fetch throws for network-level failures (server down, CORS, offline)
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      0
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  return data;
}

/* ------------------------------------------------------------------ */
/* Food requests                                                       */
/* ------------------------------------------------------------------ */

/** [CONFIRMED] GET /requests?status=open */
export function getOpenRequests() {
  return request('/requests?status=open');
}

/**
 * [EXPECTED — needs backend confirmation]
 * GET /requests/:id
 * Used to show full request details before a farmer submits an offer.
 * If this route does not exist yet, the request card's own data
 * (already fetched from getOpenRequests) is used as a fallback instead
 * of calling this endpoint — see Requests.jsx.
 */
export function getRequestById(requestId) {
  return request(`/requests/${requestId}`);
}

/* ------------------------------------------------------------------ */
/* Offers                                                               */
/* ------------------------------------------------------------------ */

/** [CONFIRMED] POST /requests/:request_id/offers */
export function submitOffer(requestId, { farmerId = CURRENT_FARMER_ID, quantity, price, deliveryDate }) {
  const payload = {
    farmer_id: farmerId,
    quantity,
    price,
  };
  if (deliveryDate) {
    payload.delivery_date = deliveryDate;
  }
  return request(`/requests/${requestId}/offers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * [EXPECTED — needs backend implementation]
 * GET /farmers/:farmer_id/offers
 * Required for the "My Offers" screen. Not part of the confirmed
 * working endpoints — flag this to the backend team if it 404s.
 */
export function getFarmerOffers(farmerId = CURRENT_FARMER_ID) {
  return request(`/farmers/${farmerId}/offers`);
}

/* ------------------------------------------------------------------ */
/* Orders                                                               */
/* ------------------------------------------------------------------ */

/**
 * [EXPECTED — needs backend implementation]
 * GET /farmers/:farmer_id/orders
 * Required for the "My Orders" and "Payments" screens.
 */
export function getFarmerOrders(farmerId = CURRENT_FARMER_ID) {
  return request(`/farmers/${farmerId}/orders`);
}

/**
 * [EXPECTED — needs backend implementation]
 * GET /orders/:id
 * Used for a single order's detail/tracking view.
 */
export function getOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export { ApiError };
