import React from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write']);
export const userSession = new UserSession({ appConfig });

function ConnectWallet() {
  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'Proof of Existence',
        icon: window.location.origin + '/logo192.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut(window.location.origin);
  };

  if (userSession.isUserSignedIn()) {
    return (
      <div>
        <p>Logged in as: {userSession.loadUserData().profile.stxAddress.testnet}</p>
        <button onClick={handleDisconnect}>Disconnect Wallet</button>
      </div>
    );
  }

  return <button onClick={handleConnect}>Connect Wallet</button>;
}

export default ConnectWallet;
