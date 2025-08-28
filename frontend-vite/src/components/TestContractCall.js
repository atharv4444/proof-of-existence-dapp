import React from 'react';
import { openContractCall } from '@stacks/connect';
import { STACKS_TESTNET } from '@stacks/network';
import { stringUtf8CV } from '@stacks/transactions';
import { userSession } from './ConnectWallet';

// Make sure these details match your LATEST deployed contract (v2)
const contractAddress = 'ST2V0KSMZVBFZ3E4AZHCAMED3RWJKRSC9P04V2FYB';
const contractName = 'proof-of-existence-v2';

function TestContractCall() {
  const handleTestCall = async () => {
    if (!userSession.isUserSignedIn()) {
      alert("Please connect your wallet first.");
      return;
    }

    console.log("--- Starting Direct Contract Call Test ---");

    // A simple, fake 64-character hash to test the contract
    const testHash = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

    const functionArgs = [
      stringUtf8CV(testHash),
    ];

    const options = {
      contractAddress,
      contractName,
      functionName: 'store-proof',
      functionArgs,
      network: STACKS_TESTNET,
      appDetails: {
        name: 'Proof of Existence (Debug Test)',
        icon: window.location.origin + '/logo192.png',
      },
      onFinish: (data) => {
        console.log("Test call SUCCESSFUL!", data);
        alert("IT WORKED! The test was successful. TXID: " + data.txId);
      },
      onCancel: () => {
        alert("Test call was cancelled.");
      },
    };

    console.log("Attempting to open wallet with these options:", options);

    try {
      await openContractCall(options);
    } catch (error) {
      console.error("CRITICAL ERROR during openContractCall:", error);
      alert("A critical error occurred trying to open the wallet. Please check the developer console.");
    }
  };

  return (
    <div style={{ border: '3px solid red', padding: '15px', margin: '20px 0', backgroundColor: '#fff0f0' }}>
      <h3>Debug Test Area</h3>
      <p>This button bypasses file hashing and calls the contract directly. Click it to isolate the problem.</p>
      <button onClick={handleTestCall} style={{ backgroundColor: '#f0ad4e', color: 'black' }}>
        Run Direct Contract Call Test
      </button>
    </div>
  );
}

export default TestContractCall;