import React, { useState, useEffect } from 'react';

// Airtable service functions
const LOCATIONS = {
  california: {
    apiKey: process.env.REACT_APP_CALIFORNIA_AIRTABLE_API_KEY,
    baseId: process.env.REACT_APP_CALIFORNIA_AIRTABLE_BASE_ID,
    tableName: 'Requirements'
  },
  indonesia: {
    apiKey: process.env.REACT_APP_INDONESIA_AIRTABLE_API_KEY,
    baseId: process.env.REACT_APP_INDONESIA_AIRTABLE_BASE_ID,
    tableName: 'Requirements'
  }
};

const fetchRequirements = async (location) => {
  const config = LOCATIONS[location];
  if (!config || !config.apiKey || !config.baseId) {
    throw new Error(`Configuration missing for location: ${location}`);
  }

  const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`;
  
  try {
    console.log(`Fetching data for ${location} from:`, url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.records.length} records for ${location}`);
    
    return data.records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error('Error fetching requirements:', error);
    throw error;
  }
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState('california');
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

  const locations = [
    { key: 'california', name: 'California, USA', flag: '🇺🇸' },
    { key: 'indonesia', name: 'Indonesia', flag: '🇮🇩' }
  ];

  // Sample fallback data
  const sampleRequirements = {
    california: [
      {
        id: 'sample-1',
        Control_ID: 'CCPA-001',
        Title: 'Consumer Right to Know',
        Framework: 'CCPA',
        Domain: 'Data Privacy',
        Risk_Level: 'High',
        Description: 'Consumers have the right to request information about categories and specific pieces of personal information collected.',
        Applicable_To: ['Web Application', 'Mobile App', 'E-commerce'],
        Implementation_Guidance: 'Implement consumer request portal with identity verification. Maintain detailed data mapping documentation.',
        Legal_Reference: 'Cal. Civ. Code § 1798.100',
        Last_Updated: '2025-01-15'
      },
      {
        id: 'sample-2',
        Control_ID: 'SB327-001',
        Title: 'Default Password Requirements',
        Framework: 'SB-327',
        Domain: 'IoT Security',
        Risk_Level: 'High',
        Description: 'Connected devices must not have default passwords that are identical across devices or easily guessable.',
        Applicable_To: ['Mobile App'],
        Implementation_Guidance: 'Require unique passwords for each device upon manufacturing. Implement password complexity requirements.',
        Legal_Reference: 'Cal. Civ. Code § 1798.91.04',
        Last_Updated: '2025-01-15'
      }
    ],
    indonesia: [
      {
        id: 'sample-3',
        Control_ID: 'UU-PDP-001',
        Title: 'Personal Data Protection',
        Framework: 'UU PDP',
        Domain: 'Data Privacy',
        Risk_Level: 'High',
        Description: 'Personal data must be processed lawfully, fairly, and in a transparent manner.',
        Applicable_To: ['Web Application', 'Mobile App', 'Financial Services'],
        Implementation_Guidance: 'Establish lawful basis for processing. Implement privacy notices and consent mechanisms.',
        Legal_Reference: 'UU No. 27 Tahun 2022',
        Last_Updated: '2025-01-15'
      }
    ]
  };

  useEffect(() => {
    loadRequirements();
  }, [selectedLocation]);

  const loadRequirements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if environment variables are configured
      const config = LOCATIONS[selectedLocation];
      if (!config?.apiKey || !config?.baseId) {
        console.log('Airtable not configured, using sample data');
        setRequirements(sampleRequirements[selectedLocation] || []);
        return;
      }

      // Try to fetch from Airtable
      const data = await fetchRequirements(selectedLocation);
      setRequirements(data);
    } catch (err) {
      console.error('Failed to load from Airtable, using sample data:', err);
      setError(`Airtable connection failed: ${err.message}. Showing sample data.`);
      setRequirements(sampleRequirements[selectedLocation] || []);
    } finally {
      setLoading(false);
    }
  };

  // Filter requirements
  const filteredRequirements = requirements.filter(req => {
    const frameworkMatch = selectedFramework === 'all' || req.Framework === selectedFramework;
    const riskMatch = selectedRiskLevel === 'all' || req.Risk_Level === selectedRiskLevel;
    return frameworkMatch && riskMatch;
  });

  // Get unique frameworks and risk levels
  const frameworks = [...new Set(requirements.map(req => req.Framework))].filter(Boolean);
  const riskLevels = [...new Set(requirements.map(req => req.Risk_Level))].filter(Boolean);

  const getRiskColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      case 'low': return '#ecfdf5';
      default: return '#f3f4f6';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch(riskLevel?.toLowerCase()) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1>🌍 GRC Compliance Lookup</h1>
        <p>Multi-Location Governance, Risk & Compliance Requirements</p>
        
        {error && (
          <div style={{background: '#fef3c7', padding: '10px', borderRadius: '8px', margin: '10px 0', border: '1px solid #f59e0b'}}>
            ⚠️ {error}
          </div>
        )}
      </header>

      {/* Controls */}
      <div style={{
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px', 
        flexWrap: 'wrap',
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <label style={{fontWeight: 'bold', marginRight: '10px', display: 'block', marginBottom: '5px'}}>
            📍 Location:
          </label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{padding: '8px 12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '200px'}}
          >
            {locations.map(loc => (
              <option key={loc.key} value={loc.key}>
                {loc.flag} {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{fontWeight: 'bold', marginRight: '10px', display: 'block', marginBottom: '5px'}}>
            📋 Framework:
          </label>
          <select 
            value={selectedFramework} 
            onChange={(e) => setSelectedFramework(e.target.value)}
            style={{padding: '8px 12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '150px'}}
          >
            <option value="all">All Frameworks</option>
            {frameworks.map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{fontWeight: 'bold', marginRight: '10px', display: 'block', marginBottom: '5px'}}>
            ⚠️ Risk Level:
          </label>
          <select 
            value={selectedRiskLevel} 
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            style={{padding: '8px 12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '120px'}}
          >
            <option value="all">All Levels</option>
            {riskLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div style={{display: 'flex', alignItems: 'end'}}>
          <button 
            onClick={loadRequirements}
            disabled={loading}
            style={{
              padding: '8px 16px', 
              fontSize: '16px', 
              borderRadius: '6px', 
              border: 'none',
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '18px'}}>📊 Loading requirements...</div>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div>
          <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>📋 Requirements for {locations.find(l => l.key === selectedLocation)?.name}</h2>
            <div style={{background: '#e0e7ff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold'}}>
              Showing {filteredRequirements.length} of {requirements.length} requirements
            </div>
          </div>

          {filteredRequirements.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
              <h3>No requirements found</h3>
              <p>Try adjusting your filters or check back later for updates.</p>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '20px'}}>
              {filteredRequirements.map(req => (
                <div 
                  key={req.id} 
                  style={{
                    border: '1px solid #d1d5db', 
                    borderRadius: '12px', 
                    padding: '24px',
                    background: getRiskColor(req.Risk_Level),
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {/* Header */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
                    <h3 style={{margin: '0', color: '#1f2937', fontSize: '20px'}}>
                      {req.Control_ID}: {req.Title}
                    </h3>
                    <span style={{
                      background: getRiskBadgeColor(req.Risk_Level),
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {req.Risk_Level}
                    </span>
                  </div>
                  
                  {/* Metadata */}
                  <div style={{display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap'}}>
                    <span style={{background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>
                      <strong>📋 Framework:</strong> {req.Framework}
                    </span>
                    <span style={{background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>
                      <strong>🏷️ Domain:</strong> {req.Domain}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p style={{lineHeight: '1.6', marginBottom: '16px', fontSize: '16px', color: '#374151'}}>
                    {req.Description}
                  </p>
                  
                  {/* Applicable To */}
                  {req.Applicable_To && (
                    <div style={{marginBottom: '16px'}}>
                      <strong style={{color: '#1f2937'}}>🎯 Applies to:</strong>{' '}
                      <span style={{color: '#6b7280'}}>
                        {Array.isArray(req.Applicable_To) ? req.Applicable_To.join(', ') : req.Applicable_To}
                      </span>
                    </div>
                  )}
                  
                  {/* Implementation Guidance */}
                  {req.Implementation_Guidance && (
                    <div style={{
                      background: 'rgba(255,255,255,0.8)', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <strong style={{color: '#1f2937', display: 'block', marginBottom: '8px'}}>
                        💡 Implementation Guidance:
                      </strong>
                      <span style={{color: '#374151', lineHeight: '1.5'}}>
                        {req.Implementation_Guidance}
                      </span>
                    </div>
                  )}
                  
                  {/* Footer */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#6b7280'}}>
                    {req.Legal_Reference && (
                      <span>
                        <strong>📖 Legal Reference:</strong> {req.Legal_Reference}
                      </span>
                    )}
                    {req.Last_Updated && (
                      <span>
                        <strong>📅 Updated:</strong> {req.Last_Updated}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div style={{
            marginTop: '40px', 
            padding: '20px', 
            background: '#f0f9ff', 
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{margin: '0 0 16px 0', color: '#1e40af'}}>📊 Summary Statistics</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
              <div>
                <strong>Total Requirements:</strong> {requirements.length}
              </div>
              <div>
                <strong>High Risk:</strong> {requirements.filter(r => r.Risk_Level === 'High').length}
              </div>
              <div>
                <strong>Frameworks:</strong> {frameworks.length}
              </div>
              <div>
                <strong>Location:</strong> {locations.find(l => l.key === selectedLocation)?.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
