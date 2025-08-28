import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from './ConnectWallet';

// A new sub-component to keep the code clean
function CollaboratorList({ proofId }) {
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/proofs/${proofId}/collaborations`)
      .then(response => {
        setCollaborators(response.data);
      })
      .catch(error => console.error("Error fetching collaborators", error));
  }, [proofId]);

  if (collaborators.length === 0) {
    return <p style={{ fontSize: '12px', color: '#666' }}>No collaborators yet.</p>;
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <h4 style={{ margin: '0 0 5px 0' }}>Collaborators:</h4>
      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
        {collaborators.map(collab => (
          <li key={collab.id}>
            <span style={{ fontFamily: 'monospace' }}>{collab.collaborator.stacksAddress}</span> ({collab.status})
          </li>
        ))}
      </ul>
    </div>
  );
}


function ProofList() {
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserAddress = userSession.isUserSignedIn() ? userSession.loadUserData().profile.stxAddress.testnet : null;

  useEffect(() => {
    if (currentUserAddress) {
      axios.get(`http://localhost:3001/api/creators/${currentUserAddress}/proofs`)
        .then(response => {
          setProofs(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching proofs:", error);
          setIsLoading(false);
        });
    }
  }, [currentUserAddress]);

  const handleAddCollaborator = async (proofId) => {
    const collaboratorAddress = window.prompt("Enter the Stacks address of the collaborator:");
    if (!collaboratorAddress) return;

    try {
      await axios.post('http://localhost:3001/api/collaborations', {
        proofId,
        collaboratorAddress,
        creatorAddress: currentUserAddress
      });
      alert('Collaboration request sent!');
      // In a real app, you'd want to refresh the collaborator list here
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error("Error adding collaborator:", error);
      alert(error.response?.data?.error || "Failed to add collaborator.");
    }
  };

  if (!currentUserAddress) {
    return null;
  }

  if (isLoading) {
    return <p>Loading proofs...</p>;
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Your Anchored Proofs</h2>
      {proofs.length === 0 ? (
        <p>You haven't submitted any proofs yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {proofs.map(proof => (
            <div key={proof.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <p><strong>File:</strong> {proof.fileName}</p>
              <p style={{ fontFamily: 'monospace', fontSize: '12px' }}><strong>Hash:</strong> {proof.fileHash}</p>
              <a 
                href={`https://explorer.stacks.co/txid/${proof.txId}?chain=testnet`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
              <button onClick={() => handleAddCollaborator(proof.id)} style={{ marginLeft: '10px' }}>
                Add Collaborator
              </button>
              <CollaboratorList proofId={proof.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProofList;