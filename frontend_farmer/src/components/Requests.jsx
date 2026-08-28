import React, { useEffect, useState } from 'react';
import { Calendar, Package, Wallet, ArrowLeft } from 'lucide-react';
import { getOpenRequests } from '../api/client';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import StatusBadge from './StatusBadge';
import OfferForm from './OfferForm';

function formatDate(dateStr) {
  if (!dateStr) return 'Not specified';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Requests() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  async function loadRequests() {
    setLoading(true);
    setError(null);
    try {
      const data = await getOpenRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function handleSelectRequest(req) {
    setOfferSubmitted(false);
    setSelectedRequest(req);
  }

  function handleBack() {
    setSelectedRequest(null);
    setOfferSubmitted(false);
  }

  function handleOfferSuccess() {
    setOfferSubmitted(true);
  }

  if (loading) return <LoadingState label="Loading food requests..." />;
  if (error) return <ErrorState message={error} onRetry={loadRequests} />;

  if (selectedRequest) {
    return (
      <div className="requests">
        <button className="btn btn--text" onClick={handleBack}>
          <ArrowLeft size={16} />
          Back to all requests
        </button>

        <div className="detail-card">
          <div className="detail-card__header">
            <h2>{selectedRequest.food_item}</h2>
            <StatusBadge status={selectedRequest.status} />
          </div>

          <div className="detail-card__grid">
            <div className="detail-item">
              <Package size={16} />
              <div>
                <p className="detail-item__label">Quantity Required</p>
                <p className="detail-item__value">
                  {selectedRequest.quantity} {selectedRequest.unit}
                </p>
              </div>
            </div>
            <div className="detail-item">
              <Wallet size={16} />
              <div>
                <p className="detail-item__label">Budget</p>
                <p className="detail-item__value">
                  KES {selectedRequest.budget} / {selectedRequest.unit}
                </p>
              </div>
            </div>
            <div className="detail-item">
              <Calendar size={16} />
              <div>
                <p className="detail-item__label">Delivery Date</p>
                <p className="detail-item__value">{formatDate(selectedRequest.delivery_date)}</p>
              </div>
            </div>
          </div>

          {offerSubmitted ? (
            <div className="success-banner">
              Your offer was submitted successfully. You can check its status
              under "My Offers".
            </div>
          ) : (
            <OfferForm request={selectedRequest} onSuccess={handleOfferSuccess} />
          )}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No open food requests are currently available."
        subtitle="Check again later for new opportunities."
      />
    );
  }

  return (
    <div className="requests">
      <div className="card-grid">
        {requests.map((req) => (
          <div className="request-card" key={req.id}>
            <div className="request-card__header">
              <span className="request-card__id">Food Request #{req.id}</span>
              <StatusBadge status={req.status} />
            </div>
            <h3 className="request-card__title">{req.food_item}</h3>
            <div className="request-card__meta">
              <p>
                <Package size={14} /> Quantity: {req.quantity} {req.unit}
              </p>
              <p>
                <Wallet size={14} /> Budget: KES {req.budget} / {req.unit}
              </p>
              <p>
                <Calendar size={14} /> Delivery: {formatDate(req.delivery_date)}
              </p>
            </div>
            <button
              className="btn btn--primary btn--full"
              onClick={() => handleSelectRequest(req)}
            >
              View Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
