import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from './ConnectWallet';

function CreatorList() {
  const [creators, setCreators] = useState([]);
  const [verifiedByMe, setVerifiedByMe] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUserAddress = userSession.isUserSignedIn() ? userSession.loadUserData().profile.stxAddress.testnet : null;

  useEffect(() => {
    // Fetch all creators
    axios.get('http://localhost:3001/api/creators')
      .then(response => {
        setCreators(response.data);
      })
      .catch(error => {
        console.error("Error fetching creators:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    
    // If user is signed in, fetch who they've verified
    if (currentUserAddress) {
      axios.get(`http://localhost:3001/api/verifications/${currentUserAddress}`)
        .then(response => {
          setVerifiedByMe(new Set(response.data));
        })
        .catch(error => {
          console.error("Error fetching verifications:", error);
        });
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
      
      // Optimistically update the UI
      setVerifiedByMe(prev => new Set(prev).add(creatorToVerifyAddress));
      alert("Creator verified successfully!");

    } catch (error) {
      console.error("Error verifying creator:", error);
      alert(error.response?.data?.message || "Failed to verify creator.");
    }
  };

  if (isLoading) {
    return <p>Loading creator network...</p>;
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Creator Network</h2>
      {creators.length === 0 ? (
        <p>No creators have joined yet.</p>
      ) : (
        <table style={{ width: '100%', textAlign: 'left' }}>
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
                  <td style={{ fontFamily: 'monospace' }}>{creator.stacksAddress}</td>
                  <td>
                    {isCurrentUser ? (
                      <i>This is you</i>
                    ) : isVerified ? (
                      <span style={{ color: 'green' }}>✔️ Verified</span>
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
      )}
    </div>
  );
}

export default CreatorList;