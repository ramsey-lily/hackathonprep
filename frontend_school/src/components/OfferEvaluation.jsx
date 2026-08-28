import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function OfferEvaluation({ requests, selectedRequestId, onOfferAccepted, onNavigate, showToast }) {
  const [currentRequestId, setCurrentRequestId] = useState(selectedRequestId || '');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRequestId) {
      setCurrentRequestId(selectedRequestId);
    }
  }, [selectedRequestId]);

  useEffect(() => {
    if (!currentRequestId) return;
    async function fetchOffers() {
      setLoading(true);
      try {
        const data = await apiClient.getRequestOffers(currentRequestId); // GET /requests/<id>/offers [cite: 288, 289]
        setOffers(data);
      } catch (err) {
        showToast('Error loading offers');
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, [currentRequestId, showToast]);

  const handleSelectOffer = async (offerId) => {
    try {
      // 1. Tell backend to select the offer and create the order
      await apiClient.selectOffer(offerId);
      
      showToast('Offer selected and order confirmed!');
      
      // 2. Reload requests and orders from the database
      await onOfferAccepted();
      
      // 3. Refresh the offers so the selected offer shows as accepted
      const updated = await apiClient.getRequestOffers(currentRequestId);
      setOffers(updated);
      
      // 4. Move automatically to Order Fulfillment
      onNavigate('fulfillment');
      
    } catch (err) {
      console.error('Error selecting offer:', err);
      showToast('Failed to select offer: ' + err.message);
    }
  };

  const selectedReq = requests.find((r) => r.id === Number(currentRequestId));

  return (
    <div>
      <div className="form-card" style={{ marginBottom: '20px' }}>
        <label className="form-label">Select Produce Request to Evaluate</label>
        <select
          className="form-select"
          value={currentRequestId}
          onChange={(e) => setCurrentRequestId(e.target.value)}
        >
          <option value="">-- Choose a Request --</option>
          {requests.map((r) => (
            <option key={r.id} value={r.id}>
              #{r.id} - {r.food_item} ({r.quantity} {r.unit}) - Status: {r.status}
            </option>
          ))}
        </select>
      </div>

      {selectedReq && (
        <div style={{ background: '#E0F2FE', padding: '16px 20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ color: '#0369A1' }}>Evaluating Request #{selectedReq.id}: {selectedReq.food_item}</h4>
          <p style={{ fontSize: '14px', color: '#0284C7' }}>
            Quantity: {selectedReq.quantity} {selectedReq.unit} | Target Budget: KES {selectedReq.budget}/unit
          </p>
        </div>
      )}

      {loading ? (
        <p>Loading incoming farmer offers...</p>
      ) : !currentRequestId ? (
        <div className="form-card" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
          Please select a food request above to view incoming farmer bids.
        </div>
      ) : offers.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No farmer offers have been submitted for this request yet.
        </div>
      ) : (
        <div className="offer-grid">
          {offers.map((offer) => {
            const isSelected = offer.status === 'selected' || offer.status === 'accepted';
            const total = offer.price * offer.quantity;
            return (
              <div key={offer.id} className={`offer-card ${isSelected ? 'selected-card' : ''}`}>
                <div className="offer-card-header">
                  <div>
                    <span className="offer-farmer-id">Farmer #{offer.farmer_id}</span>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      Offer ID: #{offer.id}
                    </div>
                  </div>
                  <span className={`badge badge-${offer.status}`}>
                    <span className="badge-dot"></span>
                    {offer.status}
                  </span>
                </div>

                <div className="offer-details">
                  <div className="offer-detail-row">
                    <span className="offer-detail-label">Offered Quantity:</span>
                    <span className="offer-detail-value">{offer.quantity} units</span>
                  </div>
                  <div className="offer-detail-row">
                    <span className="offer-detail-label">Price per Unit:</span>
                    <span className="offer-detail-value">KES {offer.price}</span>
                  </div>
                  <div className="offer-detail-row" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <span className="offer-detail-label">Total Cost:</span>
                    <span className="offer-price-highlight">KES {total.toLocaleString()}</span>
                  </div>
                </div>

                {offer.status === 'pending' && selectedReq?.status === 'open' ? (
                  <button
                    className="btn btn-emerald"
                    style={{ width: '100%' }}
                    onClick={() => handleSelectOffer(offer.id)}
                  >
                    Accept Offer & Create Order
                  </button>
                ) : isSelected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    <CheckCircle2 size={18} /> Offer Selected
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
