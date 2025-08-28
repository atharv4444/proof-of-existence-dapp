import React, { useState } from 'react';
import { userSession } from './ConnectWallet.jsx';
import { openContractCall } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { stringUtf8CV } from '@stacks/transactions';
import axios from 'axios';

const contractAddress = 'ST2V0KSMZVBFZ3E4AZHCAMED3RWJKRSC9P04V2FYB';
const contractName = 'proof-of-existence-v1';

function ProofUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setStatus('Calculating hash...');
    try {
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hashHex);
      setStatus('');
    } catch (error) {
      console.error("Error hashing file:", error);
      setStatus('Error: Could not hash the file.');
    }
  };

  const handleSubmitProof = async () => {
    if (!fileHash) return;
    setStatus('Submitting to blockchain...');
    const functionArgs = [stringUtf8CV(fileHash)];
    const options = {
      contractAddress,
      contractName,
      functionName: 'store-proof',
      functionArgs,
      network: STACKS_TESTNET,
      appDetails: {
        name: 'Creator IP Shield',
        icon: window.location.origin + '/vite.svg',
      },
      onFinish: async (data) => {
        setStatus(`Transaction broadcasted! TXID: ${data.txId}.`);
        try {
          const creatorAddress = userSession.loadUserData().profile.stxAddress.testnet;
          await axios.post('http://localhost:3001/api/proofs', {
            fileHash,
            fileName: selectedFile.name,
            creatorAddress,
            txId: data.txId,
          });
          setStatus('Proof successfully anchored and metadata saved!');
          // Optionally refresh page or state to show new proof
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          setStatus('Error saving metadata to backend.');
          console.error(error);
        }
      },
      onCancel: () => {
        setStatus('Transaction rejected.');
      },
    };
    try {
      await openContractCall(options);
    } catch (error) {
      console.error("Error opening contract call:", error);
      setStatus('Error: Could not open wallet. See console for details.');
    }
  };

  if (!userSession.isUserSignedIn()) {
    return null;
  }

  return (
    <div className="card">
      <h3>Anchor a New Proof</h3>
      <input type="file" onChange={handleFileChange} />
      {fileHash && <p><strong>File Hash (SHA-256):</strong> <code className="monospace">{fileHash}</code></p>}
      <button onClick={handleSubmitProof} disabled={!fileHash || status.includes('Submitting')}>
        Anchor Proof on Blockchain
      </button>
      {status && <p className="status-text">{status}</p>}
    </div>
  );
}

export default ProofUploader;
