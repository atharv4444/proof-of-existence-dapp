import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from './ConnectWallet';

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
    }
  }, [currentUserAddress]);

  const handleUpdateRequest = async (id, status) => {
    try {
      await axios.put(`http://localhost:3001/api/collaborations/${id}`, { status });
      // Remove the request from the list after it's been handled
      setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      alert(`Request has been ${status.toLowerCase()}.`);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update the request.");
    }
  };

  if (!currentUserAddress || requests.length === 0) {
    return null; // Don't show the component if not logged in or no requests
  }

  if (isLoading) {
    return <p>Loading collaboration requests...</p>;
  }

  return (
    <div style={{ marginTop: '40px', border: '2px solid #61dafb', padding: '15px', borderRadius: '8px' }}>
      <h2>Collaboration Requests</h2>
      {requests.map(req => (
        <div key={req.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          <p>
            Request from <strong style={{ fontFamily: 'monospace' }}>{req.proof.creator.stacksAddress}</strong>
            <br />
            To collaborate on file: <strong>{req.proof.fileName}</strong>
          </p>
          <button onClick={() => handleUpdateRequest(req.id, 'CONFIRMED')} style={{ marginRight: '10px' }}>
            Accept
          </button>
          <button onClick={() => handleUpdateRequest(req.id, 'REJECTED')} style={{ backgroundColor: '#ff6666' }}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default CollaborationRequests;