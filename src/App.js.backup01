// v7
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

// Function to load markdown content with multiple strategies
const loadMarkdownContent = async (filename) => {
  const strategies = [
    // Strategy 1: Try with PUBLIC_URL prefix
    () => fetch(`${process.env.PUBLIC_URL}/content/${filename}.md`),
    // Strategy 2: Try without PUBLIC_URL prefix
    () => fetch(`/content/${filename}.md`),
    // Strategy 3: Try with explicit path
    () => fetch(`./content/${filename}.md`),
    // Strategy 4: Try with different cache busting
    () => fetch(`/content/${filename}.md?t=${Date.now()}`)
  ];

  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Strategy ${i + 1}: Attempting to fetch ${filename}.md`);
      
      const response = await strategies[i]();
      console.log(`Strategy ${i + 1} - Response status: ${response.status}`);
      console.log(`Strategy ${i + 1} - Content-Type: ${response.headers.get('content-type')}`);
      
      if (!response.ok) {
        console.log(`Strategy ${i + 1} failed with status ${response.status}`);
        continue;
      }
      
      const content = await response.text();
      console.log(`Strategy ${i + 1} - Content length: ${content.length}`);
      console.log(`Strategy ${i + 1} - First 100 chars: "${content.substring(0, 100)}..."`);
      
      // Check if we got actual HTML instead of markdown
      const isHtmlContent = content.trim().toLowerCase().startsWith('<!doctype html>') || 
                           content.trim().toLowerCase().startsWith('<html');
      
      if (isHtmlContent) {
        console.log(`Strategy ${i + 1} - Got HTML instead of markdown, trying next strategy`);
        continue;
      }
      
      // Check if content looks like markdown (starts with # or contains markdown patterns)
      const looksLikeMarkdown = content.includes('#') || content.includes('**') || content.includes('##');
      
      if (content.length > 50 && looksLikeMarkdown) {
        console.log(`✅ Strategy ${i + 1} SUCCESS: Loaded ${filename}.md with valid markdown content`);
        return content;
      } else {
        console.log(`Strategy ${i + 1} - Content doesn't look like markdown, trying next strategy`);
        continue;
      }
      
    } catch (error) {
      console.log(`Strategy ${i + 1} failed with error:`, error.message);
      continue;
    }
  }
  
  console.error(`❌ All strategies failed to load ${filename}.md`);
  return null;
};

// Alternative: Import content directly (if fetch doesn't work)
const STATIC_CONTENT = {
  about: `# About GRC Compliance Lookup

## 🌍 Our Mission
Our mission is to simplify global compliance management by providing accessible, up-to-date governance, risk, and compliance (GRC) requirements across multiple jurisdictions. We believe that compliance should be straightforward, not overwhelming.

## 🎯 What We Do
We help organizations navigate complex regulatory landscapes by providing:
- **Centralized Requirements**: All compliance requirements in one searchable platform
- **Location-Specific Guidance**: Tailored compliance information for each jurisdiction  
- **Risk Prioritization**: Clear risk levels to help you focus on what matters most
- **Implementation Support**: Practical guidance for each requirement
- **Real-Time Updates**: Stay current with changing regulations

## 📊 Current Coverage
We currently provide comprehensive compliance requirements for:
- **🇺🇸 California, USA**: CCPA, CPRA, SB-327, and emerging privacy regulations
- **🇮🇩 Indonesia**: UU PDP (Personal Data Protection Law), OJK Financial Services Authority regulations, and Kominfo requirements

### Supported Application Types
- Web Applications
- Mobile Applications  
- E-commerce Platforms
- Financial Services
- Healthcare Systems
- IoT Devices

## 🚀 Technology Stack
Built with modern cloud architecture for reliability and scalability:
- **Frontend**: React.js with responsive design
- **Hosting**: AWS Amplify with global CDN
- **Database**: Airtable with location-specific bases
- **API Integration**: RESTful APIs with error handling
- **Deployment**: Continuous integration and deployment

## 💡 Why Choose GRC Lookup?

### For Startups
- Quick compliance assessment before market entry
- Cost-effective alternative to expensive legal consultations
- Scalable architecture that grows with your business

### For Enterprises
- Comprehensive multi-jurisdictional compliance management
- Integration-ready APIs for existing systems
- Regular updates to stay ahead of regulatory changes

### For Legal Teams
- Centralized research platform for regulatory requirements
- Export capabilities for compliance documentation
- Collaboration tools for team coordination`,

  members: `# Our Team

## 👥 Core Team

### 🧑‍💼 Technical Lead
**Arnold Castro** - *Founder & Technical Lead*

Full-stack developer with expertise in cloud architecture and compliance systems. Passionate about building scalable solutions for complex regulatory challenges. Arnold brings 5+ years of experience in enterprise software development and a deep understanding of international compliance requirements.

**Specialties**: React, AWS, Node.js, Compliance Architecture, API Design  
**Location**: Toronto, Canada

### ⚖️ Legal & Compliance Advisor
**[Position Open]** - *Senior Legal Counsel*

We're actively seeking experienced legal professionals to join our team and help expand our compliance coverage to new jurisdictions. The ideal candidate will have expertise in international privacy law and regulatory affairs.

**Ideal Background**: 
- Privacy Law (GDPR, CCPA, PIPEDA)
- International Compliance
- Regulatory Affairs
- Legal Technology

**What You'll Do**:
- Research and map compliance requirements for new jurisdictions
- Review and validate existing compliance data
- Collaborate with government agencies and regulatory bodies
- Develop implementation guidance for complex regulations

### 🎨 UX/UI Designer  
**[Position Open]** - *Senior Product Designer*

Join us to create intuitive interfaces that make complex compliance information accessible to users worldwide. We're looking for a designer who understands enterprise software and can simplify complex regulatory information.

**Ideal Background**:
- Enterprise Software Design
- Information Architecture
- Accessibility (WCAG 2.1)
- User Research & Testing

**What You'll Do**:
- Design user-friendly interfaces for compliance data
- Conduct user research with legal and compliance professionals
- Create design systems for scalable interface components
- Optimize user workflows for efficiency and clarity

## 🌟 Advisory Board

### 📊 Compliance Strategy Advisor
**[Confidential]** - *Former Fortune 500 Chief Compliance Officer*

Our advisory board includes experienced compliance executives who provide strategic guidance on product direction and market needs.

### 🌐 International Expansion Advisor
**[Confidential]** - *International Law Partner*

Legal experts who specialize in cross-border compliance and help us navigate the complexities of different legal systems worldwide.

## 🤝 Contributors & Community

### Open Source Contributors
We welcome contributions from the global compliance community:
- **Legal Research Team**: 12+ legal professionals worldwide
- **Translation Contributors**: Supporting multi-language development
- **Technical Contributors**: Developers improving our platform
- **Beta Testers**: Compliance professionals providing feedback

## 📧 Join Our Team

### Current Open Positions

#### Senior Legal Counsel (Remote)
**Requirements**:
- JD with 5+ years privacy law experience
- International compliance expertise
- Technology industry background preferred
- Excellent written and verbal communication

#### Senior Product Designer (Remote/Hybrid)
**Requirements**:
- 4+ years enterprise software design
- Strong portfolio in complex data visualization
- Experience with compliance or legal tech
- Proficiency in Figma, user research methods

#### Backend Engineer (Remote)
**Requirements**:
- 3+ years Node.js/AWS experience
- API design and database optimization
- Experience with high-traffic applications
- Interest in compliance technology

### What We Offer
- **Competitive Salary**: Market-rate compensation
- **Equity Package**: Ownership stake in our growing company
- **Remote-First**: Work from anywhere with flexible hours
- **Professional Development**: Conference attendance and training budget
- **Health Benefits**: Comprehensive health and dental coverage

## 📞 Contact & Recruitment
**Career Opportunities**: careers@grc-lookup.com  
**General Inquiries**: team@grc-lookup.com

---
*Interested in shaping the future of compliance technology? We'd love to hear from you!*`
};

const getFallbackContent = (filename) => {
  const fallbackContent = {
    about: `# About GRC Compliance Lookup

## 🌍 Our Mission
Our mission is to simplify global compliance management by providing accessible, up-to-date governance, risk, and compliance (GRC) requirements across multiple jurisdictions.

## 🎯 What We Do
We help organizations navigate complex regulatory landscapes by:
- **Centralizing Requirements**: All compliance requirements in one searchable platform
- **Location-Specific Guidance**: Tailored compliance information for each jurisdiction
- **Risk Prioritization**: Clear risk levels to help you focus on what matters most
- **Implementation Support**: Practical guidance for each requirement

## 📊 Current Coverage
- **🇺🇸 California, USA**: CCPA, CPRA, SB-327
- **🇮🇩 Indonesia**: UU PDP, OJK, Kominfo

## 🚀 Technology
Built with modern cloud architecture using React, AWS Amplify, and Airtable for scalable, reliable compliance data management.

---
*Note: This is fallback content. Please ensure about.md is available in the public/content directory.*`,

    members: `# Our Team

## 👥 Core Team

### 🧑‍💼 Technical Lead
**Arnold Castro** - *Technical Lead*

Full-stack developer with expertise in cloud architecture and compliance systems. Passionate about building scalable solutions for complex regulatory challenges.

**Specialties**: Cyber Security Architecture, AWS Solutions Architect

### ⚖️ Legal & Compliance Advisor
**[Position Open]** - *Senior Legal Counsel*

We're seeking experienced legal professionals to join our team and help expand our compliance coverage to new jurisdictions.

**Ideal Background**: Privacy Law, International Compliance, Regulatory Affairs

### 🎨 UX/UI Designer
**[Position Open]** - *Senior Product Designer*

Join us to create intuitive interfaces that make complex compliance information accessible to users worldwide.

**Ideal Background**: Enterprise Software Design, Information Architecture

## 📧 Join Our Team
Interested in contributing to the future of compliance technology? We'd love to hear from you!

**Email**: careers@grc-lookup.com

---
*Note: This is fallback content. Please ensure members.md is available in the public/content directory.*`
  };

  return fallbackContent[filename] || `# Error Loading Content\n\nSorry, we couldn't load the ${filename} page content. Please try again later.`;
};

// Improved markdown to HTML converter
const markdownToHtml = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    console.error('Invalid markdown content:', markdown);
    return '<p>Error: Invalid content format</p>';
  }

  console.log('Converting markdown to HTML, content length:', markdown.length);
  console.log('First 200 chars:', markdown.substring(0, 200));

  let html = markdown;

  // Replace line breaks with proper HTML line breaks for processing
  html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Headers (must be at start of line)
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code blocks and inline code
  html = html.replace(/```[\s\S]*?```/g, function(match) {
    const code = match.slice(3, -3).trim();
    return `<pre><code>${code}</code></pre>`;
  });
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists - handle multi-line lists better
  const lines = html.split('\n');
  const processedLines = [];
  let inList = false;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isUnorderedItem = /^[\-\*\+] (.+)/.test(line);
    const isOrderedItem = /^\d+\. (.+)/.test(line);

    if (isUnorderedItem) {
      if (!inList || listType !== 'ul') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li>${line.replace(/^[\-\*\+] /, '')}</li>`);
    } else if (isOrderedItem) {
      if (!inList || listType !== 'ol') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li>${line.replace(/^\d+\. /, '')}</li>`);
    } else {
      if (inList) {
        processedLines.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      processedLines.push(line);
    }
  }

  if (inList) {
    processedLines.push(`</${listType}>`);
  }

  html = processedLines.join('\n');

  // Paragraphs - split by double newlines and wrap non-HTML lines
  const paragraphs = html.split(/\n\s*\n/);
  html = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';
    
    // Don't wrap if it's already HTML (starts with < or contains HTML tags)
    if (para.startsWith('<') || /<\/?(h[1-6]|ul|ol|li|pre|code|strong|em|a)[\s>]/.test(para)) {
      return para;
    }
    
    // Don't wrap single line breaks within paragraphs
    return `<p>${para.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  // Clean up
  html = html.replace(/\n{3,}/g, '\n\n');
  html = html.replace(/<p><\/p>/g, '');
  
  console.log('Converted HTML length:', html.length);
  console.log('First 200 chars of HTML:', html.substring(0, 200));

  return html;
};

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState('california');
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [pageContent, setPageContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);

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
    if (currentPage === 'main') {
      loadRequirements();
    } else if (currentPage === 'about' || currentPage === 'members') {
      loadPageContent(currentPage);
    }
  }, [currentPage, selectedLocation]);

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

  const loadPageContent = async (page) => {
    setContentLoading(true);
    console.log(`🔄 Loading content for page: ${page}`);
    
    // First, let's try to verify if files exist by testing direct access
    console.log(`🔍 Testing file accessibility for ${page}.md:`);
    console.log(`1. Try opening http://localhost:3000/content/${page}.md in a new browser tab`);
    console.log(`2. Check if your file is actually at: public/content/${page}.md`);
    
    try {
      // Try loading from markdown files with multiple strategies
      const markdown = await loadMarkdownContent(page);
      
      // If we got valid markdown content (not null)
      if (markdown) {
        console.log(`✅ Successfully using loaded markdown for ${page}`);
        const html = markdownToHtml(markdown);
        setPageContent(html);
      } else {
        // Use static content as fallback
        console.log(`⚠️ Using static fallback content for ${page} (markdown files not accessible)`);
        const staticMarkdown = STATIC_CONTENT[page] || getFallbackContent(page);
        const html = markdownToHtml(staticMarkdown);
        setPageContent(html);
      }
    } catch (err) {
      console.error('❌ Error in loadPageContent:', err);
      // Final fallback: use static content
      const staticMarkdown = STATIC_CONTENT[page] || getFallbackContent(page);
      const html = markdownToHtml(staticMarkdown);
      setPageContent(html);
    } finally {
      setContentLoading(false);
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

  // Navigation component
  const Navigation = () => (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      marginBottom: '20px',
      borderBottom: '2px solid #e5e7eb'
    }}>
      <button
        onClick={() => setCurrentPage('main')}
        style={{
          background: currentPage === 'main' ? '#3b82f6' : 'transparent',
          color: currentPage === 'main' ? 'white' : '#3b82f6',
          border: '2px solid #3b82f6',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        🏠 GRC Lookup
      </button>
      
      <div style={{display: 'flex', gap: '10px'}}>
        <button
          onClick={() => setCurrentPage('about')}
          style={{
            background: currentPage === 'about' ? '#10b981' : 'transparent',
            color: currentPage === 'about' ? 'white' : '#10b981',
            border: '2px solid #10b981',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📋 About
        </button>
        
        <button
          onClick={() => setCurrentPage('members')}
          style={{
            background: currentPage === 'members' ? '#8b5cf6' : 'transparent',
            color: currentPage === 'members' ? 'white' : '#8b5cf6',
            border: '2px solid #8b5cf6',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          👥 Members
        </button>
      </div>
    </nav>
  );

  // Content page component
  const ContentPage = () => {
    if (contentLoading) {
      return (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '18px'}}>📄 Loading content...</div>
        </div>
      );
    }

    return (
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div style={{
          background: '#f8fafc',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          lineHeight: '1.6'
        }}>
          <div 
            style={{
              color: '#475569',
              fontSize: '16px'
            }}
            dangerouslySetInnerHTML={{__html: pageContent}}
          />
          
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#e0f2fe',
            borderRadius: '8px',
            border: '1px solid #0891b2',
            textAlign: 'center'
          }}>
            <p style={{margin: '0', fontWeight: 'bold', color: '#0891b2'}}>
              💡 Have questions or suggestions? 
              <br />
              <span style={{fontWeight: 'normal'}}>
                Contact us at: <strong>hello@grc-lookup.com</strong>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1>🌍 GRC Compliance Lookup</h1>
        <p>Multi-Location Governance, Risk & Compliance Requirements</p>
        
        {error && currentPage === 'main' && (
          <div style={{background: '#fef3c7', padding: '10px', borderRadius: '8px', margin: '10px 0', border: '1px solid #f59e0b'}}>
            ⚠️ {error}
          </div>
        )}
      </header>

      <Navigation />

      {/* Render different pages based on currentPage state */}
      {(currentPage === 'about' || currentPage === 'members') && <ContentPage />}
      
      {currentPage === 'main' && (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
