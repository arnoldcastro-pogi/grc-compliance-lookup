// src/services/s3Service.js
import Papa from 'papaparse';

// Configuration
const S3_CONFIG = {
  bucketUrl: process.env.REACT_APP_S3_BUCKET_URL || 'https://grc-requirements-data.s3.amazonaws.com',
  cloudFrontUrl: process.env.REACT_APP_CLOUDFRONT_URL, // Optional: Use CloudFront if configured
  cacheTimeout: 5 * 60 * 1000, // 5 minutes cache
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
};

// In-memory cache for CSV data
const cache = new Map();

// Location to filename mapping
const LOCATION_FILES = {
  california: 'california.csv',
  indonesia: 'indonesia.csv'
};

/**
 * Constructs the full URL for a CSV file
 * @param {string} filename - The CSV filename
 * @returns {string} Full URL to the CSV file
 */
const getFileUrl = (filename) => {
  const baseUrl = S3_CONFIG.cloudFrontUrl || S3_CONFIG.bucketUrl;
  return `${baseUrl}/${filename}`;
};

/**
 * Fetches and parses CSV data from S3
 * @param {string} location - Location identifier (california, indonesia)
 * @returns {Promise<Array>} Parsed requirements data
 */
export const fetchRequirementsFromS3 = async (location) => {
  const filename = LOCATION_FILES[location];
  
  if (!filename) {
    throw new Error(`Unknown location: ${location}. Available locations: ${Object.keys(LOCATION_FILES).join(', ')}`);
  }

  const csvUrl = getFileUrl(filename);
  
  console.log(`🔄 Fetching requirements for ${location} from: ${csvUrl}`);
  
  // Try with retry logic
  for (let attempt = 1; attempt <= S3_CONFIG.retryAttempts; attempt++) {
    try {
      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
          'Cache-Control': 'max-age=300' // 5 minute browser cache
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const csvText = await response.text();
      
      if (!csvText || csvText.trim().length === 0) {
        throw new Error('Empty CSV file received');
      }

      console.log(`📄 CSV loaded (${csvText.length} characters) for ${location}`);
      
      // Parse CSV with Papa Parse
      const parsedData = await parseCSVData(csvText, location);
      
      console.log(`✅ Successfully loaded ${parsedData.length} requirements for ${location}`);
      return parsedData;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed for ${location}:`, error.message);
      
      if (attempt === S3_CONFIG.retryAttempts) {
        throw new Error(`Failed to fetch ${location} data after ${S3_CONFIG.retryAttempts} attempts: ${error.message}`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, S3_CONFIG.retryDelay * attempt));
    }
  }
};

/**
 * Parses CSV text into structured data
 * @param {string} csvText - Raw CSV content
 * @param {string} location - Location identifier for ID generation
 * @returns {Promise<Array>} Processed requirements array
 */
const parseCSVData = (csvText, location) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Clean whitespace from headers
      transform: (value, header) => {
        // Clean up string values
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      },
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn(`⚠️ CSV parsing warnings for ${location}:`, results.errors);
          }

          // Process and clean the data
          const processedData = results.data
            .filter(row => row.Control_ID && row.Title) // Filter out empty rows
            .map((row, index) => ({
              id: `${location}-${row.Control_ID || index}`,
              Control_ID: row.Control_ID,
              Framework: row.Framework || 'Unknown',
              Domain: row.Domain || 'General',
              Title: row.Title,
              Description: row.Description || '',
              Applicable_To: processApplicableTo(row.Applicable_To),
              Risk_Level: row.Risk_Level || 'Medium',
              Implementation_Guidance: row.Implementation_Guidance || '',
              Legal_Reference: row.Legal_Reference || '',
              Last_Updated: row.Last_Updated || new Date().toISOString().split('T')[0]
            }));

          // Validate required fields
          const invalidRows = processedData.filter(row => !row.Control_ID || !row.Title);
          if (invalidRows.length > 0) {
            console.warn(`⚠️ Found ${invalidRows.length} rows with missing required fields`);
          }

          resolve(processedData);
          
        } catch (error) {
          reject(new Error(`Data processing error: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

/**
 * Processes the Applicable_To field which can be a string or array
 * @param {string|Array} applicableTo - Raw applicable to data
 * @returns {Array} Clean array of applicable types
 */
const processApplicableTo = (applicableTo) => {
  if (!applicableTo) return [];
  
  if (Array.isArray(applicableTo)) {
    return applicableTo.map(item => String(item).trim()).filter(Boolean);
  }
  
  if (typeof applicableTo === 'string') {
    return applicableTo
      .split(/[,;|]/) // Split on comma, semicolon, or pipe
      .map(item => item.trim())
      .filter(Boolean);
  }
  
  return [String(applicableTo)];
};

/**
 * Fetches requirements with caching
 * @param {string} location - Location identifier
 * @param {boolean} forceRefresh - Skip cache and fetch fresh data
 * @returns {Promise<Array>} Cached or fresh requirements data
 */
export const fetchRequirementsWithCache = async (location, forceRefresh = false) => {
  const cacheKey = `requirements-${location}`;
  const cached = cache.get(cacheKey);
  
  // Check if we have valid cached data
  if (!forceRefresh && cached && Date.now() - cached.timestamp < S3_CONFIG.cacheTimeout) {
    console.log(`💾 Using cached data for ${location} (${Math.round((Date.now() - cached.timestamp) / 1000)}s old)`);
    return cached.data;
  }
  
  try {
    // Fetch fresh data
    const data = await fetchRequirementsFromS3(location);
    
    // Update cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      location
    });
    
    return data;
    
  } catch (error) {
    // If we have stale cached data, return it as fallback
    if (cached && cached.data) {
      console.warn(`⚠️ Using stale cache for ${location} due to fetch error:`, error.message);
      return cached.data;
    }
    
    throw error;
  }
};

/**
 * Prefetches data for all locations
 * @returns {Promise<Object>} Object with all location data
 */
export const prefetchAllLocations = async () => {
  console.log('🚀 Prefetching all location data...');
  
  const results = {};
  const locations = Object.keys(LOCATION_FILES);
  
  await Promise.allSettled(
    locations.map(async (location) => {
      try {
        results[location] = await fetchRequirementsWithCache(location);
        console.log(`✅ Prefetched ${location}: ${results[location].length} items`);
      } catch (error) {
        console.error(`❌ Failed to prefetch ${location}:`, error.message);
        results[location] = [];
      }
    })
  );
  
  return results;
};

/**
 * Gets unique frameworks for a location
 * @param {Array} requirements - Requirements array
 * @returns {Array} Unique frameworks
 */
export const getUniqueFrameworks = (requirements) => {
  return [...new Set(requirements.map(req => req.Framework))].filter(Boolean).sort();
};

/**
 * Gets unique risk levels for a location
 * @param {Array} requirements - Requirements array
 * @returns {Array} Unique risk levels
 */
export const getUniqueRiskLevels = (requirements) => {
  return [...new Set(requirements.map(req => req.Risk_Level))].filter(Boolean).sort();
};

/**
 * Gets unique domains for a location
 * @param {Array} requirements - Requirements array
 * @returns {Array} Unique domains
 */
export const getUniqueDomains = (requirements) => {
  return [...new Set(requirements.map(req => req.Domain))].filter(Boolean).sort();
};

/**
 * Clears cache for a specific location or all locations
 * @param {string} location - Location to clear, or null for all
 */
export const clearCache = (location = null) => {
  if (location) {
    const cacheKey = `requirements-${location}`;
    cache.delete(cacheKey);
    console.log(`🗑️ Cleared cache for ${location}`);
  } else {
    cache.clear();
    console.log('🗑️ Cleared all cache');
  }
};

/**
 * Gets cache status information
 * @returns {Object} Cache statistics
 */
export const getCacheStatus = () => {
  const status = {
    size: cache.size,
    entries: []
  };
  
  cache.forEach((value, key) => {
    status.entries.push({
      key,
      location: value.location,
      itemCount: value.data.length,
      age: Math.round((Date.now() - value.timestamp) / 1000),
      isStale: Date.now() - value.timestamp > S3_CONFIG.cacheTimeout
    });
  });
  
  return status;
};

// Export configuration for debugging
export const getConfig = () => S3_CONFIG;

// Export available locations
export const getAvailableLocations = () => Object.keys(LOCATION_FILES);
