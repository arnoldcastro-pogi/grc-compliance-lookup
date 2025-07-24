const LOCATIONS = {
  california: {
    apiKey: process.env.REACT_APP_CALIFORNIA_AIRTABLE_API_KEY,
    baseId: process.env.REACT_APP_CALIFORNIA_AIRTABLE_BASE_ID,
    tableName: process.env.REACT_APP_CALIFORNIA_AIRTABLE_TABLE_NAME || 'Requirements'
  },
  indonesia: {
    apiKey: process.env.REACT_APP_INDONESIA_AIRTABLE_API_KEY,
    baseId: process.env.REACT_APP_INDONESIA_AIRTABLE_BASE_ID,
    tableName: process.env.REACT_APP_INDONESIA_AIRTABLE_TABLE_NAME || 'Requirements'
  }
};

export const fetchRequirements = async (location, filters = {}) => {
  const config = LOCATIONS[location];
  if (!config) throw new Error(`Location ${location} not supported`);

  const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableName}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data.records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return [];
  }
};

export const getAvailableLocations = () => {
  return Object.keys(LOCATIONS);
};
