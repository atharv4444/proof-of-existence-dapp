import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from './ConnectWallet.jsx';

function CollaborationRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserAddress = userSession.isUserSignedIn() ? userSession.loadUserData().profile.stxAddress.testnet : null;

  useEffect(() => {
    if (currentUserAddress) {
      axios.get(`http://localhost:3001/api/collaborations/incoming/${currentUserAddress}`)
        .then(response => {
          setRequests(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching collaboration requests:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentUserAddress]);

  const handleUpdateRequest = async (id, status) => {
    try {
      await axios.put(`http://localhost:3001/api/collaborations/${id}`, { status });
      setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      alert(`Request has been ${status.toLowerCase()}.`);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request.");
    }
  };

  if (!userSession.isUserSignedIn() || requests.length === 0) {
    return null;
  }

  if (isLoading) {
    return <div className="card collaboration-requests"><h2>Loading Requests...</h2></div>;
  }

  return (
    <div className="card collaboration-requests">
      <h2>Collaboration Requests</h2>
      {requests.map(req => (
        <div key={req.id} className="proof-card">
          <p>
            Request from <code className="monospace">{req.proof.creator.stacksAddress}</code>
            <br />
            To collaborate on file: <strong>{req.proof.fileName}</strong>
          </p>
          <button onClick={() => handleUpdateRequest(req.id, 'CONFIRMED')} style={{ marginRight: '10px' }}>
            Accept
          </button>
          <button onClick={() => handleUpdateRequest(req.id, 'REJECTED')} className="button-reject">
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default CollaborationRequests;
