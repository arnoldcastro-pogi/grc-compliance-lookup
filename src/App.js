import React, { useState, useEffect } from 'react';
import { awsMCPClient } from './services/mcpClient';

// Enhanced requirement card component with AWS guidance
const EnhancedRequirementCard = ({ requirement, awsGuidance, onGetAWSGuidance }) => {
  const [showGuidance, setShowGuidance] = useState(false);
  const [loadingGuidance, setLoadingGuidance] = useState(false);

  const handleGetGuidance = async () => {
    if (!awsGuidance) {
      setLoadingGuidance(true);
      await onGetAWSGuidance(requirement);
      setLoadingGuidance(false);
    }
    setShowGuidance(!showGuidance);
  };

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
    <div style={{
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      padding: '24px',
      background: getRiskColor(requirement.Risk_Level),
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
        <h3 style={{margin: '0', color: '#1f2937', fontSize: '20px'}}>
          {requirement.Control_ID}: {requirement.Title}
        </h3>
        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
          <span style={{
            background: getRiskBadgeColor(requirement.Risk_Level),
            color: 'white',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {requirement.Risk_Level}
          </span>
          <button
            onClick={handleGetGuidance}
            disabled={loadingGuidance}
            style={{
              background: '#f97316',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: loadingGuidance ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loadingGuidance ? '⏳' : '☁️'} AWS Guide
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div style={{display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap'}}>
        <span style={{background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>
          <strong>📋 Framework:</strong> {requirement.Framework}
        </span>
        <span style={{background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>
          <strong>🏷️ Domain:</strong> {requirement.Domain}
        </span>
      </div>

      {/* Description */}
      <p style={{lineHeight: '1.6', marginBottom: '16px', fontSize: '16px', color: '#374151'}}>
        {requirement.Description}
      </p>

      {/* AWS Guidance Section */}
      {showGuidance && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #f97316',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '16px'
        }}>
          <h4 style={{margin: '0 0 16px 0', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px'}}>
            ☁️ AWS Implementation Guidance
            {awsGuidance?.source && (
              <span style={{fontSize: '12px', color: '#6b7280', fontWeight: 'normal'}}>
                via {awsGuidance.source}
              </span>
            )}
          </h4>
          
          {awsGuidance ? (
            <>
              {/* AWS Services */}
              {awsGuidance.awsServices && awsGuidance.awsServices.length > 0 && (
                <div style={{marginBottom: '16px'}}>
                  <strong style={{color: '#1f2937', display: 'block', marginBottom: '8px'}}>
                    🔧 Recommended AWS Services:
                  </strong>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {awsGuidance.awsServices.map((service, index) => (
                      <span key={index} style={{
                        background: '#fef3c7',
                        border: '1px solid #f59e0b',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Implementation Steps */}
              {awsGuidance.implementationSteps && awsGuidance.implementationSteps.length > 0 && (
                <div style={{marginBottom: '16px'}}>
                  <strong style={{color: '#1f2937', display: 'block', marginBottom: '8px'}}>
                    📋 Implementation Steps:
                  </strong>
                  <ol style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                    {awsGuidance.implementationSteps.map((step, index) => (
                      <li key={index} style={{marginBottom: '4px', lineHeight: '1.4'}}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Cost Considerations */}
              {awsGuidance.costConsiderations && awsGuidance.costConsiderations.length > 0 && (
                <div style={{marginBottom: '12px'}}>
                  <strong style={{color: '#1f2937', display: 'block', marginBottom: '8px'}}>
                    💰 Cost Considerations:
                  </strong>
                  <ul style={{margin: '0', paddingLeft: '20px', color: '#374151'}}>
                    {awsGuidance.costConsiderations.map((cost, index) => (
                      <li key={index} style={{marginBottom: '4px'}}>
                        {cost}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{fontSize: '12px', color: '#6b7280', marginTop: '12px'}}>
                🕒 Last updated: {new Date(awsGuidance.lastUpdated).toLocaleDateString()}
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>⚠️</div>
              <p>AWS guidance temporarily unavailable. Please try again later.</p>
            </div>
          )}
        </div>
      )}

      {/* Original requirement details */}
      {requirement.Applicable_To && (
        <div style={{marginBottom: '16px'}}>
          <strong style={{color: '#1f2937'}}>🎯 Applies to:</strong>{' '}
          <span style={{color: '#6b7280'}}>
            {Array.isArray(requirement.Applicable_To) ? requirement.Applicable_To.join(', ') : requirement.Applicable_To}
          </span>
        </div>
      )}

      {requirement.Implementation_Guidance && (
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
            {requirement.Implementation_Guidance}
          </span>
        </div>
      )}

      {/* Footer */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#6b7280'}}>
        {requirement.Legal_Reference && (
          <span>
            <strong>📖 Legal Reference:</strong> {requirement.Legal_Reference}
          </span>
        )}
        {requirement.Last_Updated && (
          <span>
            <strong>📅 Updated:</strong> {requirement.Last_Updated}
          </span>
        )}
      </div>
    </div>
  );
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState('california');
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [awsGuidanceCache, setAwsGuidanceCache] = useState(new Map());
  const [mcpConnected, setMcpConnected] = useState(false);
  const [regionalCompliance, setRegionalCompliance] = useState(null);

  const locations = [
    { key: 'california', name: 'California, USA', flag: '🇺🇸' },
    { key: 'indonesia', name: 'Indonesia', flag: '🇮🇩' }
  ];

  // Sample requirements data
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
        Applicable_To: ['IoT Devices', 'Mobile App'],
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

  // Initialize MCP connection
  useEffect(() => {
    const initializeMCP = async () => {
      try {
        const connected = await awsMCPClient.connect();
        setMcpConnected(connected);
        
        if (connected) {
          console.log('🎉 MCP integration active - AWS guidance available!');
        } else {
          console.log('📋 MCP offline - using enhanced fallback guidance');
        }
      } catch (error) {
        console.error('Failed to initialize MCP:', error);
        setMcpConnected(false);
      }
    };

    initializeMCP();

    // Cleanup on unmount
    return () => {
      awsMCPClient.disconnect();
    };
  }, []);

  // Load requirements when location changes
  useEffect(() => {
    loadRequirements();
  }, [selectedLocation]);

  const loadRequirements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use sample data for demo (replace with your Airtable logic)
      setRequirements(sampleRequirements[selectedLocation] || []);
    } catch (err) {
      console.error('Failed to load requirements:', err);
      setError(`Failed to load requirements: ${err.message}`);
      setRequirements(sampleRequirements[selectedLocation] || []);
    } finally {
      setLoading(false);
    }
  };

  // Get AWS guidance for a specific requirement
  const handleGetAWSGuidance = async (requirement) => {
    const cacheKey = requirement.Control_ID;
    
    if (awsGuidanceCache.has(cacheKey)) {
      return; // Already cached
    }

    try {
      const guidance = await awsMCPClient.getAWSComplianceGuidance(requirement);
      
      setAwsGuidanceCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, guidance);
        return newCache;
      });
    } catch (error) {
      console.error('Failed to get AWS guidance:', error);
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

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1>🌍 GRC Compliance Lookup</h1>
        <p>Multi-Location Governance, Risk & Compliance Requirements</p>
        
        {/* MCP Connection Status */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: mcpConnected ? '#ecfdf5' : '#fef3c7',
          border: `1px solid ${mcpConnected ? '#059669' : '#f59e0b'}`,
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          <span>{mcpConnected ? '✅' : '⚠️'}</span>
          <span style={{fontWeight: 'bold'}}>
            AWS Knowledge: {mcpConnected ? 'Connected' : 'Offline (using fallback)'}
          </span>
        </div>

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
            <div>
              {filteredRequirements.map(req => (
                <EnhancedRequirementCard
                  key={req.id}
                  requirement={req}
                  awsGuidance={awsGuidanceCache.get(req.Control_ID)}
                  onGetAWSGuidance={handleGetAWSGuidance}
                />
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
              <div>
                <strong>AWS Integration:</strong> {mcpConnected ? '✅ Active' : '⚠️ Fallback Mode'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
