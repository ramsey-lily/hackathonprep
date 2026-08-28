import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [foodRequests, setFoodRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/requests?status=open')
      .then((response) => response.json())
      .then((data) => {
        setFoodRequests(data);
      })
      .catch((error) => {
        console.error('Error loading requests:', error);
      });
  }, []);

  const submitOffer = () => {
    if (!price || !quantity) {
      alert('Please enter price and quantity.');
      return;
    }

    fetch(
      `http://127.0.0.1:5000/requests/${selectedRequest.id}/offers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmer_id: 1,
          quantity: Number(quantity),
          price: Number(price),
        }),
      }
    )
      .then((response) => response.json())
      .then(() => {
        setOfferSubmitted(true);
      })
      .catch((error) => {
        console.error('Error submitting offer:', error);
        alert('Could not submit offer.');
      });
  };

  return (
    <div className="App">
      <h1>🌾 Farmer Dashboard</h1>

      {!selectedRequest && (
        <>
          <p>
            Welcome to the Kasarani School Food Supply System!
          </p>

          <h2>Available Food Requests</h2>

          {foodRequests.length === 0 ? (
            <p>No open food requests available.</p>
          ) : (
            foodRequests.map((request) => (
              <div key={request.id}>
                <h3>{request.food_item}</h3>

                <p>
                  Quantity: {request.quantity} {request.unit}
                </p>

                <p>
                  Budget: KSh {request.budget}
                </p>

                <p>
                  Delivery Date: {request.delivery_date}
                </p>

                <button
                  onClick={() => setSelectedRequest(request)}
                >
                  View Request
                </button>
              </div>
            ))
          )}
        </>
      )}

      {selectedRequest && (
        <div>
          <h2>Food Request Details</h2>

          <p>
            <strong>School:</strong> Kasarani Secondary School
          </p>

          <p>
            <strong>Food:</strong> {selectedRequest.food_item}
          </p>

          <p>
            <strong>Quantity:</strong> {selectedRequest.quantity}{' '}
            {selectedRequest.unit}
          </p>

          <p>
            <strong>Budget:</strong> KSh {selectedRequest.budget}
          </p>

          <p>
            <strong>Delivery Date:</strong>{' '}
            {selectedRequest.delivery_date}
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

              <label>Quantity:</label>
              <br />

              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <br />
              <br />

              <button onClick={submitOffer}>
                Submit Offer
              </button>
            </div>
          ) : (
            <p>✅ Your offer was submitted successfully!</p>
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