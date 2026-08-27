import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function CreateRequestForm({ schoolId, onRequestCreated, showToast }) {
  const [formData, setFormData] = useState({
    food_item: '',
    quantity: '',
    unit: 'kg',
    budget: '',
    delivery_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API expects: { school_id, food_item, quantity, unit, budget, delivery_date } [cite: 285]
      const payload = {
        school_id: schoolId,
        food_item: formData.food_item,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        budget: Number(formData.budget),
        delivery_date: formData.delivery_date,
      };

      await onRequestCreated(payload);
      showToast('Produce request published to marketplace!');
      setFormData({ food_item: '', quantity: '', unit: 'kg', budget: '', delivery_date: '' });
    } catch (err) {
      showToast('Error creating request: ' + err.message);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">
        <PlusCircle size={20} color="var(--accent-emerald)" /> Create Food Request
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full">
            <label className="form-label">Food Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maize, Beans, Rice"
              value={formData.food_item}
              onChange={(e) => setFormData({ ...formData, food_item: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-input"
              placeholder="500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <select
              className="form-select"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="bags">Bags</option>
              <option value="tonnes">Tonnes</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Budget per Unit (KES)</label>
            <input
              type="number"
              className="form-input"
              placeholder="35"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Date Required</label>
            <input
              type="date"
              className="form-input"
              value={formData.delivery_date}
              onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '20px' }}>
          Publish Request
        </button>
      </form>
    </div>
  );
}