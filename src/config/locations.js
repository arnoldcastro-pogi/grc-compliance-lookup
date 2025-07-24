// Location-specific configuration
export const LOCATIONS = {
  california: {
    name: 'California, USA',
    flag: '🇺🇸',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    frameworks: ['CCPA', 'CPRA', 'SB-327'],
    applicationTypes: ['Web Application', 'Mobile App', 'E-commerce', 'Healthcare']
  },
  indonesia: {
    name: 'Indonesia',
    flag: '🇮🇩', 
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    frameworks: ['UU PDP', 'OJK', 'Kominfo'],
    applicationTypes: ['Web Application', 'Mobile App', 'Financial Services', 'Healthcare']
  }
};

export const DEFAULT_LOCATION = 'california';
