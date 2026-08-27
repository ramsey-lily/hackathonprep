// Central API Client aligning with the specification

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiClient = {
  // GET /schools/:id/requests [cite: 280]
  async getSchoolRequests(schoolId) {
    const res = await fetch(`${API_BASE_URL}/schools/${schoolId}/requests`);
    if (!res.ok) throw new Error('Failed to fetch school requests');
    return res.json();
  },

  // POST /requests [cite: 284, 285]
  async createRequest(payload) {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create food request');
    return res.json();
  },

  // GET /requests/:id/offers [cite: 288, 289]
  async getRequestOffers(requestId) {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/offers`);
    if (!res.ok) throw new Error('Failed to fetch offers for request');
    return res.json();
  },

  // PATCH /offers/:id/select [cite: 289, 290]
  async selectOffer(offerId) {
    const res = await fetch(`${API_BASE_URL}/offers/${offerId}/select`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to select offer');
    return res.json();
  },

  // GET /schools/:id/orders [cite: 280, 281]
  async getSchoolOrders(schoolId) {
    const res = await fetch(`${API_BASE_URL}/schools/${schoolId}/orders`);
    if (!res.ok) throw new Error('Failed to fetch school orders');
    return res.json();
  }
};