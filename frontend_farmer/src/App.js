import { useState } from 'react';
import './App.css';

function App() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [myOffers, setMyOffers] = useState([]);
  const [showOffers, setShowOffers] = useState(false);

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const foodRequests = [
    {
      id: 1,
      food: 'Beans',
      quantity: '100 kg',
      deadline: '30 August 2026',
    },
    {
      id: 2,
      food: 'Maize',
      quantity: '200 kg',
      deadline: '2 September 2026',
    },
    {
      id: 3,
      food: 'Rice',
      quantity: '150 kg',
      deadline: '5 September 2026',
    },
  ];

  const submitOffer = () => {
    const newOffer = {
      food: selectedRequest.food,
      quantity: quantity,
      price: price,
      deliveryDate: deliveryDate,
      status: 'Pending',
    };

    setMyOffers([...myOffers, newOffer]);
    setOfferSubmitted(true);
  };

  return (
    <div className="App">

      <h1> Farmer Dashboard</h1>

      {!selectedRequest && !showOffers && (
        <>
          <p>
            Welcome to the Kasarani School Food Supply System!
          </p>

          <button onClick={() => setShowOffers(true)}>
             My Offers
          </button>

          <h2>Available Food Requests</h2>

          {foodRequests.map((request) => (
            <div key={request.id}>
              <h3>{request.food}</h3>

              <p>Quantity: {request.quantity}</p>

              <p>Deadline: {request.deadline}</p>

              <button
                onClick={() => setSelectedRequest(request)}
              >
                View Request
              </button>
            </div>
          ))}
        </>
      )}

      {showOffers && (
        <div>
          <h2> My Offers</h2>

          {myOffers.length === 0 ? (
            <p>You haven't submitted any offers yet.</p>
          ) : (
            myOffers.map((offer, index) => (
              <div key={index}>
                <h3>{offer.food}</h3>

                <p>
                  Quantity: {offer.quantity}
                </p>

                <p>
                  Price: KSh {offer.price} per kg
                </p>

                <p>
                  Delivery Date: {offer.deliveryDate}
                </p>

                <p>
                  Status: {offer.status} ⏳
                </p>
              </div>
            ))
          )}

          <button onClick={() => setShowOffers(false)}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      {selectedRequest && (
        <div>
          <h2>Food Request Details</h2>

          <p>
            <strong>School:</strong> Kasarani Secondary School
          </p>

          <p>
            <strong>Food:</strong> {selectedRequest.food}
          </p>

          <p>
            <strong>Requested Quantity:</strong>{' '}
            {selectedRequest.quantity}
          </p>

          <p>
            <strong>Deadline:</strong>{' '}
            {selectedRequest.deadline}
          </p>

          {!offerSubmitted ? (
            <div>
              <h3>Submit Your Offer</h3>

              <label>Price per kg:</label>
              <br />

              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <br />
              <br />

              <label>Available quantity:</label>
              <br />

              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <br />
              <br />

              <label>Delivery date:</label>
              <br />

              <input
                type="date"
                value={deliveryDate}
                onChange={(e) =>
                  setDeliveryDate(e.target.value)
                }
              />

              <br />
              <br />

              <button onClick={submitOffer}>
                Submit Offer
              </button>
            </div>
          ) : (
            <p>
              ✅ Your offer has been submitted successfully!
            </p>
          )}

          <br />

          <button
            onClick={() => {
              setSelectedRequest(null);
              setOfferSubmitted(false);
              setPrice('');
              setQuantity('');
              setDeliveryDate('');
            }}
          >
            ← Back to Requests
          </button>
        </div>
      )}

    </div>
  );
}

export default App;