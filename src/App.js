import React, { useState } from 'react';

function App() {
  const [selectedLocation, setSelectedLocation] = useState('california');

  const locations = [
    { key: 'california', name: 'California, USA', flag: '🇺🇸' },
    { key: 'indonesia', name: 'Indonesia', flag: '🇮🇩' }
  ];

  // Sample data for testing
  const sampleRequirements = {
    california: [
      {
        id: '1',
        Control_ID: 'CCPA-001',
        Title: 'Consumer Right to Know',
        Framework: 'CCPA',
        Domain: 'Data Privacy',
        Risk_Level: 'High',
        Description: 'Consumers have the right to request information about personal data collected.',
        Applicable_To: ['Web Application', 'Mobile App']
      },
      {
        id: '2',
        Control_ID: 'SB327-001',
        Title: 'Default Password Requirements',
        Framework: 'SB-327',
        Domain: 'IoT Security',
        Risk_Level: 'High',
        Description: 'Connected devices must not have default passwords.',
        Applicable_To: ['Mobile App']
      }
    ],
    indonesia: [
      {
        id: '3',
        Control_ID: 'UU-PDP-001',
        Title: 'Personal Data Protection',
        Framework: 'UU PDP',
        Domain: 'Data Privacy',
        Risk_Level: 'High',
        Description: 'Personal data must be processed lawfully and fairly.',
        Applicable_To: ['Web Application', 'Mobile App']
      }
    ]
  };

  const requirements = sampleRequirements[selectedLocation] || [];

  const getRiskColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#ecfdf5';
      default: return '#f3f4f6';
    }
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1>🌍 GRC Compliance Lookup</h1>
        <p>Multi-Location Governance, Risk & Compliance Requirements</p>
        <div style={{background: '#d1fae5', padding: '10px', borderRadius: '8px', margin: '20px 0'}}>
          ✅ Application loaded successfully! Airtable integration coming next.
        </div>
      </header>

      <div style={{marginBottom: '20px'}}>
        <label style={{fontWeight: 'bold', marginRight: '10px'}}>Location:</label>
        <select 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc'}}
        >
          {locations.map(loc => (
            <option key={loc.key} value={loc.key}>
              {loc.flag} {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2>📋 Sample Requirements for {locations.find(l => l.key === selectedLocation)?.name}</h2>
        <p>Showing {requirements.length} sample requirements</p>

        <div style={{display: 'grid', gap: '20px', marginTop: '20px'}}>
          {requirements.map(req => (
            <div 
              key={req.id} 
              style={{
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                padding: '20px',
                background: getRiskColor(req.Risk_Level)
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px'}}>
                <h3 style={{margin: '0', color: '#1f2937'}}>{req.Control_ID}: {req.Title}</h3>
                <span style={{
                  background: req.Risk_Level === 'High' ? '#dc2626' : req.Risk_Level === 'Medium' ? '#d97706' : '#059669',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {req.Risk_Level}
                </span>
              </div>
              
              <div style={{marginBottom: '15px'}}>
                <strong>Framework:</strong> {req.Framework} | <strong>Domain:</strong> {req.Domain}
              </div>
              
              <p style={{lineHeight: '1.5', marginBottom: '15px'}}>{req.Description}</p>
              
              <div style={{marginBottom: '10px'}}>
                <strong>Applies to:</strong> {req.Applicable_To.join(', ')}
              </div>
            </div>
          ))}
        </div>

        <div style={{background: '#fef3c7', padding: '15px', borderRadius: '8px', marginTop: '30px'}}>
          <h3>🔧 Next Steps:</h3>
          <ol>
            <li>✅ Basic React app working</li>
            <li>🔄 Add Airtable API integration</li>
            <li>🔄 Add real-time data filtering</li>
            <li>🔄 Add export functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
