# Data Architecture

## Overview
The GRC Compliance Lookup uses a location-based data architecture that scales efficiently across jurisdictions while maintaining data integrity and performance.

## Location-Specific Bases

### California Base Structure
- **Base Name**: `GRC-Requirements-California`
- **Table**: `Requirements`
- **Frameworks**: CCPA, CPRA, SB-327
- **Application Types**: Web Application, Mobile App, E-commerce, Healthcare

### Indonesia Base Structure  
- **Base Name**: `GRC-Requirements-Indonesia`
- **Table**: `Requirements`
- **Frameworks**: UU PDP, OJK, Kominfo
- **Application Types**: Web Application, Mobile App, Financial Services, Healthcare

## Schema Consistency
All location bases maintain the same field structure:
- Control_ID (Primary Key)
- Framework (Single Select)
- Domain (Single Select) 
- Title (Single Line Text)
- Description (Long Text)
- Applicable_To (Multiple Select)
- Risk_Level (Single Select)
- Implementation_Guidance (Long Text)
- Legal_Reference (Single Line Text)
- Last_Updated (Date)

## Scaling Strategy
1. **Add New Location**: Create new Airtable base with consistent schema
2. **Update Environment Variables**: Add new location configuration
3. **Update Location Selector**: Add new option to frontend
4. **Deploy**: Automatic deployment via Amplify CI/CD

## API Rate Limiting
- Airtable Free Tier: 5 requests/second per base
- Implementation: Request queuing and caching strategy
- Fallback: Cached data for high availability
