import React from 'react';
import { userSession } from '../user-session.js';
import { showConnect } from '@stacks/connect';

const ConnectWallet = () => {
  const handleSignIn = () => {
    showConnect({
      appDetails: {
        name: 'Proof of Existence dApp',
        icon: window.location.origin + '/logo.svg',
      },
      redirectTo: '/',
    });
  };

  const handleSignOut = () => {
    userSession.signUserOut(window.location.origin);
  };

  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData();
    return (
      <div style={{ textAlign: 'right' }}>
        <p>Logged in as: {userData.profile.stxAddress.testnet}</p>
        <button onClick={handleSignOut}>Disconnect Wallet</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'right' }}>
      <button onClick={handleSignIn}>Connect Wallet</button>
    </div>
  );
};

export default ConnectWallet;