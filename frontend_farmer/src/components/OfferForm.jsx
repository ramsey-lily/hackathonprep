import React, { useState } from 'react';
import { submitOffer } from '../api/client';

export default function OfferForm({ request, onSuccess }) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function validate() {
    const nextErrors = {};
    const qtyNum = Number(quantity);
    const priceNum = Number(price);

    if (quantity === '' || Number.isNaN(qtyNum)) {
      nextErrors.quantity = 'Quantity is required.';
    } else if (qtyNum <= 0) {
      nextErrors.quantity = 'Quantity must be a positive number.';
    }

    if (price === '' || Number.isNaN(priceNum)) {
      nextErrors.price = 'Price is required.';
    } else if (priceNum <= 0) {
      nextErrors.price = 'Price must be a positive number.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (submitting) return; // guard against double-click / duplicate submits
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitOffer(request.id, {
        quantity: Number(quantity),
        price: Number(price),
        deliveryDate: deliveryDate || undefined,
      });
      setQuantity('');
      setPrice('');
      setDeliveryDate('');
      setErrors({});
      onSuccess();
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="offer-form" onSubmit={handleSubmit}>
      <h3>Submit an Offer</h3>

      {submitError && <div className="error-banner">{submitError}</div>}

      <div className="form-row">
        <label htmlFor="quantity">Quantity you can supply ({request.unit})</label>
        <input
          id="quantity"
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={`e.g. ${request.quantity}`}
        />
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="price">Price per {request.unit} (KES)</label>
        <input
          id="price"
          type="number"
          min="0"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={`e.g. ${request.budget}`}
        />
        {errors.price && <span className="field-error">{errors.price}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="deliveryDate">Delivery date (optional)</label>
        <input
          id="deliveryDate"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn--primary btn--full" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Offer'}
      </button>
    </form>
  );
}
