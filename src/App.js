import React from 'react';

function App() {
  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
      <header>
        <h1>🌍 GRC Compliance Lookup</h1>
        <p>Multi-Location Governance, Risk & Compliance Requirements</p>
      </header>
      
      <main>
        <div style={{background: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '20px 0'}}>
          <h2>✅ Deployment Successful!</h2>
          <p><strong>Supported Locations:</strong></p>
          <ul>
            <li>🇺🇸 California, USA - CCPA, CPRA, SB-327</li>
            <li>🇮🇩 Indonesia - UU PDP, OJK, Kominfo</li>
          </ul>
        </div>
        
        <div style={{background: '#fef3c7', padding: '15px', borderRadius: '8px'}}>
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Connect Airtable data integration</li>
            <li>Add location selector component</li>
            <li>Build requirements filtering system</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default App;
