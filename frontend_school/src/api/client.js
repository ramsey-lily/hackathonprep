// Central API Client aligning with the specification

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiClient = {
  // GET /schools/:id/requests
  async getSchoolRequests(schoolId) {
    const res = await fetch(`${API_BASE_URL}/schools/${schoolId}/requests`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch school requests');
    }
    
    return res.json();
  },
  
  // POST /requests
  async createRequest(payload) {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create food request');
    }
    
    return res.json();
  },
  
  // GET /requests/:id/offers
  async getRequestOffers(requestId) {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/offers`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch offers for request');
    }
    
    return res.json();
  },
  
  // PATCH /offers/:id/select
  async selectOffer(offerId) {
    const res = await fetch(`${API_BASE_URL}/offers/${offerId}/select`, {
      method: 'PATCH',
    });
    
    if (!res.ok) {
      throw new Error('Failed to select offer');
    }
    
    return res.json();
  },
  
  // GET /schools/:id/orders
  async getSchoolOrders(schoolId) {
    const res = await fetch(`${API_BASE_URL}/schools/${schoolId}/orders`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch school orders');
    }
    
    return res.json();
  },
  
  // POST /payments/mpesa
  async initiateMpesaPayment(phone, orderId) {
    const res = await fetch(`${API_BASE_URL}/payments/mpesa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        order_id: orderId,
      }),
    });
    
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to initiate M-Pesa payment');
    }
    
    return res.json();
  },
};
