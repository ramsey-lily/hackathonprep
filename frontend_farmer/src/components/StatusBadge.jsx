import React from 'react';

/**
 * Renders a colored pill for any status string (offer, order, or
 * payment status). Unknown statuses still render — they just fall back
 * to a neutral gray rather than breaking.
 */

const STATUS_STYLES = {
  // offers
  pending: { bg: '#FFF4E5', color: '#8A5A00', label: 'Pending' },
  accepted: { bg: '#E6F4EA', color: '#1E7B34', label: 'Accepted' },
  rejected: { bg: '#FDEAEA', color: '#B3261E', label: 'Rejected' },

  // requests
  open: { bg: '#E6F4EA', color: '#1E7B34', label: 'Open' },
  closed: { bg: '#EFEFEF', color: '#5F5F5F', label: 'Closed' },

  // orders
  confirmed: { bg: '#E6F4EA', color: '#1E7B34', label: 'Confirmed' },
  preparing: { bg: '#E8F0FE', color: '#1A4FBF', label: 'Preparing' },
  out_for_delivery: { bg: '#EAE6FA', color: '#5B3EBF', label: 'Out for Delivery' },
  delivered: { bg: '#E6F4EA', color: '#1E7B34', label: 'Delivered' },
  cancelled: { bg: '#FDEAEA', color: '#B3261E', label: 'Cancelled' },

  // payments
  unpaid: { bg: '#EFEFEF', color: '#5F5F5F', label: 'Unpaid' },
  paid: { bg: '#E6F4EA', color: '#1E7B34', label: '✓ Paid' },
  failed: { bg: '#FDEAEA', color: '#B3261E', label: 'Failed' },
};

export default function StatusBadge({ status }) {
  if (!status) {
    return <span className="badge badge--neutral">Unknown</span>;
  }

  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const style = STATUS_STYLES[key] || {
    bg: '#EFEFEF',
    color: '#5F5F5F',
    label: status,
  };

  return (
    <span
      className="badge"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
