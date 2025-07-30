// src/services/contentService.js
import { marked } from 'marked';

// S3 configuration for content files
const S3_BUCKET_URL = process.env.REACT_APP_S3_CONTENT_BUCKET_URL || 'https://your-bucket.s3.amazonaws.com';
const CONTENT_PATH = 'content'; // folder in S3 bucket

// Configure marked options for better rendering
marked.setOptions({
  breaks: true,
  gfm: true, // GitHub Flavored Markdown
  headerIds: true,
  mangle: false,
  sanitize: false // Be careful with this in production
});

// Custom renderer for better styling
const renderer = new marked.Renderer();

// Custom heading renderer with anchor links
renderer.heading = function(text, level, raw) {
  const anchor = raw.toLowerCase().replace(/[^\w\\-]+/g, '-');
  return `<h${level} id="${anchor}" class="content-heading level-${level}">${text}</h${level}>`;
};

// Custom link renderer for external links
renderer.link = function(href, title, text) {
  const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}${target} class="content-link">${text}</a>`;
};

// Custom list renderer
renderer.list = function(body, ordered, start) {
  const type = ordered ? 'ol' : 'ul';
  const startAttr = ordered && start !== 1 ? ` start="${start}"` : '';
  return `<${type}${startAttr} class="content-list">${body}</${type}>`;
};

marked.use({ renderer });

class ContentService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch content from S3 with caching
   */
  async fetchContent(filename) {
    const cacheKey = filename;
    const cached = this.cache.get(cacheKey);
    
    // Check if cached content is still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`Using cached content for ${filename}`);
      return cached.content;
    }

    try {
      const url = `${S3_BUCKET_URL}/${CONTENT_PATH}/${filename}`;
      console.log(`Fetching content from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      
      // Cache the content
      this.cache.set(cacheKey, {
        content,
        timestamp: Date.now()
      });

      return content;
    } catch (error) {
      console.error(`Error fetching content ${filename}:`, error);
      
      // Return fallback content if available
      const fallback = this.getFallbackContent(filename);
      if (fallback) {
        console.log(`Using fallback content for ${filename}`);
        return fallback;
      }
      
      throw error;
    }
  }

  /**
   * Parse markdown content to HTML
   */
  parseMarkdown(markdown) {
    try {
      return marked(markdown);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return `<p>Error parsing content: ${error.message}</p>`;
    }
  }

  /**
   * Load and parse About page content
   */
  async loadAboutContent() {
    try {
      const markdown = await this.fetchContent('about.md');
      return {
        html: this.parseMarkdown(markdown),
        raw: markdown,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading about content:', error);
      return {
        html: this.getFallbackAboutHTML(),
        raw: this.getFallbackContent('about.md'),
        lastUpdated: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Load and parse Members page content
   */
  async loadMembersContent() {
    try {
      const markdown = await this.fetchContent('members.md');
      const html = this.parseMarkdown(markdown);
      
      // Extract team members data for programmatic use
      const members = this.extractMembersData(markdown);
      
      return {
        html,
        raw: markdown,
        members,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading members content:', error);
      return {
        html: this.getFallbackMembersHTML(),
        raw: this.getFallbackContent('members.md'),
        members: this.getFallbackMembersData(),
        lastUpdated: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Extract structured member data from markdown
   */
  extractMembersData(markdown) {
    const members = [];
    const memberBlocks = markdown.split('###').slice(1); // Skip first empty block
    
    memberBlocks.forEach(block => {
      const lines = block.trim().split('\n');
      if (lines.length < 2) return;
      
      const titleLine = lines[0].trim();
      const nameParts = titleLine.split(' - ');
      if (nameParts.length < 2) return;
      
      const name = nameParts[0].trim();
      const role = nameParts[1].trim();
      
      const member = { name, role };
      
      // Extract structured data
      lines.forEach(line => {
        if (line.startsWith('**LinkedIn:**')) {
          member.linkedin = line.replace('**LinkedIn:**', '').trim();
        } else if (line.startsWith('**Email:**')) {
          member.email = line.replace('**Email:**', '').trim();
        } else if (line.startsWith('**Location:**')) {
          member.location = line.replace('**Location:**', '').trim();
        } else if (line.startsWith('**Role:**')) {
          member.fullRole = line.replace('**Role:**', '').trim();
        }
      });
      
      // Extract bio (text after structured fields and before expertise)
      const bioStart = lines.findIndex(line => line.trim() && !line.startsWith('**'));
      const expertiseStart = lines.findIndex(line => line.startsWith('**Expertise:**'));
      
      if (bioStart !== -1 && expertiseStart !== -1) {
        member.bio = lines.slice(bioStart, expertiseStart).join('\n').trim();
      }
      
      members.push(member);
    });
    
    return members;
  }

  /**
   * Clear cache (useful for content updates)
   */
  clearCache() {
    this.cache.clear();
    console.log('Content cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      filename: key,
      cachedAt: new Date(value.timestamp).toISOString(),
      age: Date.now() - value.timestamp
    }));
    
    return {
      count: this.cache.size,
      entries
    };
  }

  /**
   * Fallback content for when S3 is unavailable
   */
  getFallbackContent(filename) {
    const fallbacks = {
      'about.md': `# About GRC Compliance Lookup

*Content temporarily unavailable. Please check back later.*

Our GRC Compliance Lookup platform helps organizations navigate complex regulatory requirements across multiple jurisdictions.

## Current Status
- Service is running normally
- Content is being updated
- Please refresh the page in a few moments`,

      'members.md': `# Team Members

*Team information temporarily unavailable.*

Our team consists of experienced professionals in compliance, technology, and regulatory affairs.

Please check back shortly for detailed team member information.`
    };
    
    return fallbacks[filename] || '# Content Unavailable\n\nPlease check back later.';
  }

  getFallbackAboutHTML() {
    return marked(this.getFallbackContent('about.md'));
  }

  getFallbackMembersHTML() {
    return marked(this.getFallbackContent('members.md'));
  }

  getFallbackMembersData() {
    return [
      {
        name: 'Team Information',
        role: 'Loading...',
        bio: 'Team member information is being loaded.',
        linkedin: '#',
        email: 'team@grccompliance.com'
      }
    ];
  }
}

// Singleton instance
const contentService = new ContentService();

export default contentService;
