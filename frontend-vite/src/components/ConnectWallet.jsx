import React from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

function ConnectWallet() {
  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'Creator IP Shield',
        icon: window.location.origin + '/vite.svg', // Vite default icon
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
    const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
    return (
      <div>
        <span className="monospace" style={{ marginRight: '15px' }}>
          {`${userAddress.substring(0, 5)}...${userAddress.substring(userAddress.length - 5)}`}
        </span>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={handleConnect}>Connect Wallet</button>;
}

export default ConnectWallet;
