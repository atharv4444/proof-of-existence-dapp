import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from '../user-session.js';

function CreatorList() {
  const [creators, setCreators] = useState([]);
  const [verifiedByMe, setVerifiedByMe] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const currentUserAddress = userSession.isUserSignedIn() ? userSession.loadUserData().profile.stxAddress.testnet : null;

  useEffect(() => {
    axios.get('http://localhost:3001/api/creators')
      .then(response => setCreators(response.data))
      .catch(error => console.error("Error fetching creators:", error))
      .finally(() => setIsLoading(false));
    
    if (currentUserAddress) {
      axios.get(`http://localhost:3001/api/verifications/${currentUserAddress}`)
        .then(response => setVerifiedByMe(new Set(response.data)))
        .catch(error => console.error("Error fetching verifications:", error));
    }
  }, [currentUserAddress]);

  const handleVerify = async (creatorToVerifyAddress) => {
    if (!currentUserAddress) {
      alert("Please connect your wallet to verify a creator.");
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/verifications', {
        verifierAddress: currentUserAddress,
        creatorToVerifyAddress,
      });
      setVerifiedByMe(prev => new Set(prev).add(creatorToVerifyAddress));
      alert("Creator verified successfully!");
    } catch (error) {
      console.error("Error verifying creator:", error);
      alert(error.response?.data?.message || "Failed to verify creator.");
    }
  };

  if (isLoading) return <div className="card"><h2>Loading Creator Network...</h2></div>;

  return (
    <div className="card">
      <h2>Creator Network</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Creator Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {creators.map(creator => {
            const isCurrentUser = creator.stacksAddress === currentUserAddress;
            const isVerified = verifiedByMe.has(creator.stacksAddress);
            return (
              <tr key={creator.id}>
                <td><code className="monospace">{creator.stacksAddress}</code></td>
                <td>
                  {isCurrentUser ? (
                    <i>This is you</i>
                  ) : isVerified ? (
                    <span className="verified-text">✔️ Verified</span>
                  ) : (
                    <button onClick={() => handleVerify(creator.stacksAddress)}>
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CreatorList;
