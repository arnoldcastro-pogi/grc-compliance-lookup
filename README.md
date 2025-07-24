# Multi-Location GRC Compliance Lookup

A scalable web application for looking up Governance, Risk & Compliance legal requirements across multiple jurisdictions. Currently supports California (USA) and Indonesia with architecture designed for global expansion.

## 🌍 Supported Locations
- **California, USA** - CCPA, CPRA, SB-327
- **Indonesia** - Personal Data Protection Law, Financial Services Authority Regulations

## 🏗️ Architecture
- **Frontend**: React hosted on AWS Amplify
- **Database**: Airtable with location-specific bases
- **CDN**: AWS CloudFront (global distribution)
- **API**: Airtable REST API with location routing

## ✨ Features
- **Location Selection**: Choose jurisdiction for targeted compliance requirements
- **Framework Filtering**: Filter by regulation type (Privacy, Financial, Cybersecurity, etc.)
- **Application Type Matching**: Get requirements specific to your app type (Web, Mobile, Financial Services)
- **Risk-Based Prioritization**: Sort by compliance risk level (High/Medium/Low)
- **Export Capabilities**: Generate compliance checklists per location
- **Scalable Data Architecture**: Easy addition of new jurisdictions

## 🚀 Tech Stack
- **Hosting**: AWS Amplify (with global CDN)
- **Frontend**: React.js with responsive design
- **Data Backend**: Airtable (location-specific bases)
- **Styling**: Tailwind CSS
- **State Management**: React Context/Hooks
- **Build Tool**: Create React App

## 📊 Data Architecture

### Location-Specific Requirements
