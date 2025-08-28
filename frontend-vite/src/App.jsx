import React from 'react';
import ConnectWallet from './components/ConnectWallet.jsx';
import ProofUploader from './components/ProofUploader.jsx';
import CreatorList from './components/CreatorList.jsx';
import ProofList from './components/ProofList.jsx';
import CollaborationRequests from './components/CollaborationRequests.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Creator IP Shield</h1>
        <ConnectWallet />
      </header>
      <main>
        <CollaborationRequests />
        <ProofUploader />
        <ProofList />
        <CreatorList />
      </main>
    </div>
  );
}

export default App;