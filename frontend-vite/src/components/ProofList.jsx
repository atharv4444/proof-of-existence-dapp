import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { userSession } from './ConnectWallet.jsx';

function CollaboratorList({ proofId }) {
  const [collaborators, setCollaborators] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:3001/api/proofs/${proofId}/collaborations`)
      .then(response => setCollaborators(response.data))
      .catch(error => console.error("Error fetching collaborators", error));
  }, [proofId]);

  if (collaborators.length === 0) {
    return <p style={{ fontSize: '12px', color: '#aaa' }}>No collaborators yet.</p>;
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>Collaborators:</h4>
      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
        {collaborators.map(collab => (
          <li key={collab.id}>
            <code className="monospace">{collab.collaborator.stacksAddress}</code> ({collab.status})
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
    } else {
      setIsLoading(false);
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
      window.location.reload();
    } catch (error) {
      console.error("Error adding collaborator:", error);
      alert(error.response?.data?.error || "Failed to add collaborator.");
    }
  };

  if (!userSession.isUserSignedIn()) return null;
  if (isLoading) return <div className="card"><h2>Loading Proofs...</h2></div>;

  return (
    <div className="card">
      <h2>Your Anchored Proofs</h2>
      {proofs.length === 0 ? (
        <p>You haven't submitted any proofs yet.</p>
      ) : (
        <div>
          {proofs.map(proof => (
            <div key={proof.id} className="proof-card">
              <p><strong>File:</strong> {proof.fileName}</p>
              <p><strong>Hash:</strong> <code className="monospace">{proof.fileHash}</code></p>
              <a href={`https://explorer.stacks.co/txid/${proof.txId}?chain=testnet`} target="_blank" rel="noopener noreferrer">
                View on Explorer
              </a>
              <button onClick={() => handleAddCollaborator(proof.id)} style={{ marginLeft: '15px' }}>
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
