import React from 'react';
import { CURRENT_FARMER_ID } from '../api/client';
import { EmptyState } from './StateViews';
import { UserCircle } from 'lucide-react';

/**
 * There is no farmer authentication or profile endpoint yet, so this
 * screen is intentionally minimal rather than inventing farmer details.
 * Once the backend exposes something like GET /farmers/:id, wire it up
 * here the same way the other screens call the API client.
 */
export default function Profile() {
  return (
    <div className="profile">
      <EmptyState
        icon={<UserCircle size={32} />}
        title="Farmer profile and login are not implemented yet."
        subtitle={`This prototype currently acts as farmer ID ${CURRENT_FARMER_ID}. Once the backend adds authentication, this screen should show the farmer's real name, contact details, and let them log in.`}
      />
    </div>
  );
}
