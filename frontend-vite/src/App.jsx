import React from 'react';
import ConnectWallet from './components/ConnectWallet.jsx';
import ProofUploader from './components/ProofUploader.jsx';
import ProofList from './components/ProofList';
import CreatorList from './components/CreatorList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Proof of Existence dApp</h1>
        <ConnectWallet />
      </header>
      <main>
        <h3>Submit a New Proof</h3>
        <ProofUploader />
        <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />
        <h3>Your Anchored Proofs</h3>
        <ProofList />
        <hr style={{ margin: '40px 0', border: '1px solid #eee' }} />
        <h3>Creator Network</h3>
        <CreatorList />
      </main>
    </div>
  );
}

export default App;