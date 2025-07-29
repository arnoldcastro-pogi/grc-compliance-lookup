// src/services/mcpClient.js - Browser-Compatible Version
class AWSKnowledgeMCPClient {
  constructor() {
    this.isConnected = false;
    this.cache = new Map();
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.baseUrl = 'https://knowledge-mcp.global.api.aws';
  }

  async connect() {
    this.connectionAttempts++;
    
    try {
      console.log(`🔄 Testing connection to AWS Knowledge MCP server (attempt ${this.connectionAttempts})`);
      
      // Test connection with a simple HTTP request
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              roots: {
                listChanged: false
              },
              sampling: {}
            },
            clientInfo: {
              name: 'grc-compliance-client',
              version: '1.0.0'
            }
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          this.isConnected = true;
          console.log('✅ Successfully connected to AWS Knowledge MCP server');
          console.log('📋 MCP server capabilities:', data.result.capabilities);
          return true;
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      console.error(`❌ Connection attempt ${this.connectionAttempts} failed:`, error.message);
      this.isConnected = false;
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.connect();
      }
      
      console.error('❌ Max connection attempts reached. Using fallback mode.');
      return false;
    }
  }

  async disconnect() {
    this.isConnected = false;
    console.log('🔌 Disconnected from AWS MCP server');
  }

  // Get AWS compliance guidance for a specific requirement
  async getAWSComplianceGuidance(requirement) {
    if (!this.isConnected) {
      console.log('📋 MCP offline - using fallback guidance');
      return this.getFallbackGuidance(requirement);
    }

    const cacheKey = `aws-guidance-${requirement.Control_ID}`;
    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached guidance for', requirement.Control_ID);
      return this.cache.get(cacheKey);
    }

    try {
      console.log('🔍 Fetching AWS guidance for:', requirement.Title);
      
      // Build query based on requirement
      const query = this.buildComplianceQuery(requirement);
      console.log('🔍 Query:', query);
      
      // Call the AWS Knowledge MCP server via HTTP
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'search_documentation',
            arguments: {
              query: query,
              max_results: 5
            }
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const guidance = this.processAWSResponse(data.result, requirement);
          this.cache.set(cacheKey, guidance);
          console.log('✅ Successfully fetched AWS guidance');
          return guidance;
        }
      }
      
      throw new Error(`MCP call failed: ${response.status}`);
      
    } catch (error) {
      console.error('❌ Error fetching AWS guidance:', error.message);
      console.log('📋 Falling back to static guidance');
      return this.getFallbackGuidance(requirement);
    }
  }

  buildComplianceQuery(requirement) {
    const domain = requirement.Domain?.toLowerCase() || '';
    const framework = requirement.Framework?.toLowerCase() || '';
    
    // Enhanced query mapping for AWS Knowledge server
    const queryMap = {
      'data privacy': `AWS data privacy encryption KMS CloudTrail GDPR CCPA compliance`,
      'iot security': `AWS IoT Core device security certificates authentication`,
      'financial services': `AWS financial services compliance regulations banking`,
      'cybersecurity': `AWS security GuardDuty Security Hub WAF Shield cybersecurity`,
      'access control': `AWS IAM access control authentication authorization`,
      'data protection': `AWS data protection encryption S3 KMS at rest in transit`
    };

    let query = queryMap[domain] || `AWS ${domain} ${framework} compliance best practices`;
    
    // Add application context
    if (requirement.Applicable_To) {
      const appTypes = Array.isArray(requirement.Applicable_To) 
        ? requirement.Applicable_To.join(' ') 
        : requirement.Applicable_To;
      query += ` ${appTypes.toLowerCase()}`;
    }

    return query;
  }

  processAWSResponse(mcpResult, requirement) {
    console.log('📊 Processing AWS MCP response...');
    
    try {
      const awsServices = new Set();
      const implementationSteps = [];
      const costConsiderations = [];
      
      if (mcpResult && mcpResult.content) {
        // Handle different response formats from AWS MCP server
        let content = '';
        if (Array.isArray(mcpResult.content)) {
          content = mcpResult.content.map(c => {
            if (typeof c === 'string') return c;
            if (c.text) return c.text;
            if (c.type === 'text' && c.text) return c.text;
            return c.toString();
          }).join(' ');
        } else if (mcpResult.content.text) {
          content = mcpResult.content.text;
        } else {
          content = mcpResult.content.toString();
        }
        
        console.log('📄 AWS MCP response preview:', content.substring(0, 300) + '...');
        
        // Extract AWS services with improved patterns
        const servicePatterns = [
          /Amazon\s+([A-Z][a-zA-Z\s]+?)(?=\s|,|\.|$)/g,
          /AWS\s+([A-Z][a-zA-Z\s]+?)(?=\s|,|\.|$)/g,
          /(GuardDuty|CloudTrail|CloudWatch|KMS|S3|EC2|Lambda|IAM|Shield|WAF|Config|Systems Manager|Macie|Inspector|Certificate Manager)/gi
        ];
        
        servicePatterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const service = match[1]?.trim() || match[0]?.trim();
            if (service && service.length > 2 && service.length < 35) {
              // Clean up common false positives
              if (!service.toLowerCase().includes('documentation') && 
                  !service.toLowerCase().includes('guide') &&
                  !service.toLowerCase().includes('tutorial')) {
                awsServices.add(service);
              }
            }
          }
        });

        // Extract implementation steps
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const actionWords = ['implement', 'configure', 'enable', 'use', 'set up', 'deploy', 'create', 'establish', 'activate', 'install'];
        
        sentences.forEach(sentence => {
          const lowerSentence = sentence.toLowerCase().trim();
          if (actionWords.some(word => lowerSentence.includes(word)) && implementationSteps.length < 5) {
            // Clean up and format the sentence
            let cleanSentence = sentence.trim();
            if (cleanSentence.length > 10 && cleanSentence.length < 200) {
              // Capitalize first letter
              cleanSentence = cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1);
              implementationSteps.push(cleanSentence);
            }
          }
        });

        // Extract cost considerations
        if (content.toLowerCase().includes('cost') || content.toLowerCase().includes('pricing')) {
          costConsiderations.push('Review AWS pricing calculator for detailed cost estimates');
          costConsiderations.push('Consider using AWS Cost Explorer for ongoing cost monitoring');
        }
        
        // Add default cost consideration if none found
        if (costConsiderations.length === 0) {
          costConsiderations.push('Use AWS Cost Calculator to estimate implementation costs');
        }
      }

      const guidance = {
        awsServices: Array.from(awsServices).slice(0, 8), // Limit to 8 services
        implementationSteps: implementationSteps.slice(0, 5), // Limit to 5 steps
        costConsiderations,
        lastUpdated: new Date().toISOString(),
        source: 'AWS Knowledge MCP Server (Remote)'
      };

      console.log('✅ Processed guidance:', {
        services: guidance.awsServices.length,
        steps: guidance.implementationSteps.length
      });

      return guidance;
    } catch (error) {
      console.error('❌ Error processing AWS MCP response:', error);
      return this.getFallbackGuidance(requirement);
    }
  }

  getFallbackGuidance(requirement) {
    console.log('📋 Using enhanced fallback guidance for:', requirement.Domain);
    
    const domain = requirement.Domain?.toLowerCase() || '';
    
    const fallbackMap = {
      'data privacy': {
        awsServices: ['Amazon S3', 'AWS KMS', 'AWS CloudTrail', 'Amazon Macie', 'AWS Config', 'Amazon GuardDuty'],
        implementationSteps: [
          'Enable encryption at rest using AWS KMS for all data storage systems',
          'Configure CloudTrail for comprehensive audit logging and compliance tracking',
          'Use Amazon Macie for automated data discovery and classification',
          'Implement S3 bucket policies with least privilege access controls',
          'Set up AWS Config rules for continuous compliance monitoring',
          'Deploy data loss prevention policies using Amazon Macie'
        ],
        costConsiderations: [
          'KMS key usage charges apply per encryption/decryption operation',
          'CloudTrail charges for events logged and S3 storage costs',
          'Macie pricing based on data processed and classification jobs'
        ]
      },
      'iot security': {
        awsServices: ['AWS IoT Core', 'AWS IoT Device Management', 'AWS Certificate Manager', 'AWS IoT Device Defender', 'Amazon CloudWatch'],
        implementationSteps: [
          'Use X.509 certificates for secure device authentication and identity',
          'Implement fine-grained device policies in IoT Core with minimal permissions',
          'Enable IoT Device Defender for continuous security monitoring and threat detection',
          'Configure over-the-air updates for security patches and firmware updates',
          'Set up device fleet management with automated compliance reporting',
          'Implement device shadowsfor offline device state management'
        ],
        costConsiderations: [
          'IoT Core charges per message published/delivered',
          'Certificate Manager provides free SSL/TLS certificates',
          'Device Defender charges per device monitored monthly'
        ]
      },
      'cybersecurity': {
        awsServices: ['Amazon GuardDuty', 'AWS Security Hub', 'AWS WAF', 'AWS Shield', 'Amazon Inspector', 'AWS Config'],
        implementationSteps: [
          'Enable GuardDuty for intelligent threat detection across your AWS environment',
          'Configure Security Hub for centralized security findings management',
          'Implement WAF rules for application layer protection against common attacks',
          'Set up automated incident response workflows using Lambda and SNS',
          'Deploy Inspector for automated security assessments of applications and infrastructure',
          'Use AWS Config for continuous security compliance monitoring'
        ],
        costConsiderations: [
          'GuardDuty charges per GB of logs analyzed and per million DNS queries',
          'Security Hub charges per security check per region',
          'WAF charges per web ACL, rule, and request processed'
        ]
      },
      'financial services': {
        awsServices: ['AWS Config', 'Amazon CloudWatch', 'AWS Systems Manager', 'AWS CloudFormation', 'AWS CloudTrail', 'Amazon Inspector'],
        implementationSteps: [
          'Use AWS Config for continuous compliance monitoring and configuration management',
          'Implement comprehensive logging and monitoring with CloudWatch',
          'Deploy Systems Manager for automated patch management and compliance',
          'Establish Infrastructure as Code practices with CloudFormation templates',
          'Set up automated compliance reporting and audit trail documentation',
          'Implement security scanning with Amazon Inspector for regulatory compliance'
        ],
        costConsiderations: [
          'Config charges per configuration item recorded per region',
          'CloudWatch charges for metrics, logs storage, and dashboard usage',
          'Systems Manager Patch Manager is free but EC2 usage charges apply'
        ]
      },
      'access control': {
        awsServices: ['AWS IAM', 'Amazon Cognito', 'AWS Single Sign-On', 'AWS Directory Service', 'AWS CloudTrail'],
        implementationSteps: [
          'Implement least privilege access using IAM roles and policies',
          'Use Amazon Cognito for user authentication and authorization',
          'Set up multi-factor authentication (MFA) for all user accounts',
          'Configure AWS Single Sign-On for centralized access management',
          'Enable CloudTrail for comprehensive access logging and audit trails',
          'Implement regular access reviews and automated policy validation'
        ],
        costConsiderations: [
          'IAM is free for AWS account users and roles',
          'Cognito charges per monthly active user',
          'AWS SSO is free for up to 5 users, then charges per user per month'
        ]
      }
    };

    const fallback = fallbackMap[domain] || {
      awsServices: ['AWS Config', 'AWS CloudFormation', 'AWS Systems Manager', 'Amazon CloudWatch', 'AWS CloudTrail'],
      implementationSteps: [
        'Use AWS Config for compliance monitoring and configuration management',
        'Implement Infrastructure as Code with CloudFormation templates',
        'Enable Systems Manager for centralized configuration and patch management',
        'Set up CloudWatch for comprehensive monitoring and alerting',
        'Establish automated compliance reporting workflows',
        'Configure CloudTrail for complete audit logging and governance'
      ],
      costConsiderations: [
        'Contact AWS sales for detailed pricing information based on your usage patterns',
        'Use AWS Cost Calculator to estimate implementation costs',
        'Consider AWS savings plans for predictable workloads'
      ]
    };

    return {
      ...fallback,
      lastUpdated: new Date().toISOString(),
      source: 'Enhanced Fallback Guidance (AWS MCP Server Offline)'
    };
  }

  // Test connection method for debugging
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'ping'
        })
      });

      console.log('Connection test response:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const awsMCPClient = new AWSKnowledgeMCPClient();
export default awsMCPClient;
