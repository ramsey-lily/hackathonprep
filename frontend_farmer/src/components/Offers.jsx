import React, { useEffect, useState } from 'react';
import { getFarmerOffers } from '../api/client';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import StatusBadge from './StatusBadge';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Offers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);

  async function loadOffers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getFarmerOffers();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, []);

  if (loading) return <LoadingState label="Loading your offers..." />;
  if (error) return <ErrorState message={error} onRetry={loadOffers} />;

  if (offers.length === 0) {
    return <EmptyState title="You haven't submitted any offers yet." />;
  }

  return (
    <div className="offers">
      <div className="card-grid">
        {offers.map((offer) => {
          const total =
            offer.total ??
            (offer.quantity && offer.price ? offer.quantity * offer.price : null);
          const submittedDate = formatDate(offer.created_at || offer.date_submitted);

          return (
            <div className="offer-card" key={offer.id}>
              <div className="offer-card__header">
                <span className="offer-card__id">Offer #{offer.id}</span>
                <StatusBadge status={offer.status} />
              </div>
              <h3 className="offer-card__title">
                {offer.food_item || 'Item'} — Request #{offer.request_id}
              </h3>
              <div className="offer-card__meta">
                <p>Quantity: {offer.quantity} {offer.unit || ''}</p>
                <p>Price: KES {offer.price}{offer.unit ? `/${offer.unit}` : ''}</p>
                {total !== null && <p>Total: KES {Number(total).toLocaleString()}</p>}
                {submittedDate && <p>Submitted: {submittedDate}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
